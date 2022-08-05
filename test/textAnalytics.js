import * as ort from 'onnxruntime-node';

describe('textAnalytics', () => {
    const client = require('../src-packed/textAnalytics');

    it('Negative', async () => {
        const result = await client.analyzeSentiment(ort, "This is terrible!");
        expect(result.sentences[0].sentiment).to.be.equal("negative");
    });

    it('Neutral', async () => {
        const result = await client.analyzeSentiment(ort, "Hello, World!");
        expect(result.sentences[0].sentiment).to.be.equal("neutral");
    });

    it('Positive', async () => {
        const result = await client.analyzeSentiment(ort, "This is great!");
        expect(result.sentences[0].sentiment).to.be.equal("neutral"); //NOTE: we don't know if it's positive anymore
    });

    it('Lots of text', async () => {
        const result = await client.analyzeSentiment(ort,
`You are terrible. Looks good to me.
This code sucks.
I love you.
Amazing, job ship it.
This code is stupid.`
        );
        expect(result.sentences.length).to.be.equal(6);
        expect(result.sentences[0].sentiment).to.be.equal("negative");
        expect(result.sentences[1].sentiment).to.be.equal("neutral");
        expect(result.sentences[2].sentiment).to.be.equal("negative");
        expect(result.sentences[3].sentiment).to.be.equal("neutral");
        expect(result.sentences[4].sentiment).to.be.equal("neutral");
        expect(result.sentences[5].sentiment).to.be.equal("negative");
    });

    it('Fenced code blocks negative', async () => {
        const result = await client.analyzeSentiment(ort, "```\nThis is terrible!\n```\nHello, World!\n");
        expect(result.sentences[0].sentiment).to.be.equal("neutral");
    });

    it('Fenced code blocks negative, offset', async () => {
        const text1 = "```\nHello, World!\n```\n";
        const text2 = "This is terrible!\n";
        const result = await client.analyzeSentiment(ort, text1 + text2);
        var sentence = result.sentences[result.sentences.length - 1];
        expect(sentence.sentiment).to.be.equal("negative");
        expect(sentence.offset).to.be.equal(text1.length);
        expect(sentence.length).to.be.equal(text2.length);
    });

    it('Indented code blocks negative', async () => {
        const result = await client.analyzeSentiment(ort, "    This is terrible!\nHello, World!\n");
        expect(result.sentences[0].sentiment).to.be.equal("neutral");
    });

    it('Indented code blocks negative, offset', async () => {
        const text1 = "This is terrible!\n";
        const text2 = "    Hello, World!";
        const result = await client.analyzeSentiment(ort, text1 + text2);
        var sentence = result.sentences[0];
        expect(sentence.sentiment).to.be.equal("negative");
        expect(sentence.offset).to.be.equal(0);
        expect(sentence.length).to.be.equal(text1.length);
    });

    it('Preprocess 1', () => {
        const result = client.preprocessText ("abc");
        expect(result).to.be.equal("abc");
    });

    it('Preprocess Indented 1', () => {
        const result = client.preprocessText ("    abc");
        expect(result).to.be.equal("       ");
    });

    it('Preprocess Indented 2', () => {
        const result = client.preprocessText ("    abc\ndef\n    ghi");
        expect(result).to.be.equal("       \ndef\n       ");
    });

    it('Preprocess Fenced 1', () => {
        const result = client.preprocessText ("```abc\ndef\n```ghi");
        expect(result).to.be.equal("      \n   \n   ghi");
    });

    it("Ignorable sentence", async () => {
        const result = await client.analyzeSentiment(ort, "I see a couple of new warnings and errors.");
        expect(result.sentences[0].sentiment).not.to.be.equal("negative");
    });

    it("Ignorable negative sentence", async () => {
        const result = await client.analyzeSentiment(ort, "There are some new test failures, this is terrible.");
        expect(result.sentences[0].sentiment).to.be.equal("negative");
    });

    it("Ignorable sentence and negative sentence, offset and length", async () => {
        const sen1 = "I see a new error in the build.";
        const sen2 = "This is the worst thing that has ever happened."
        const result = await client.analyzeSentiment(ort, [sen1, sen2]);
        var res1 = result.sentences[0];
        var res2 = result.sentences[1];
        expect(res1.sentiment).not.to.be.equal("negative");
        expect(res2.sentiment).to.be.equal("negative");
        expect(res1.offset).to.be.equal(0);
        expect(res2.offset).to.be.equal(sen1.length);
        expect(res1.length).to.be.equal(sen1.length);
        expect(res2.length).to.be.equal(sen2.length);
    });

    it('Image tag 1', () => {
        const text = client.preprocessText ("abc![image](abc)def");
        expect(text).to.be.equal           ("abc. image.     def");
    });

    it('Image tag 2', () => async () => {
        const text = client.preprocessText ("abc![image](https://bad.com/this/is/terrible)def");
        expect(text).to.be.equal           ("abc. image.                                  def");
        const result = await client.analyzeSentiment(ort, text);
        expect(result.sentences[0].sentiment).to.be.equal("neutral");
    });

    it('Image tag 3', () => async () => {
        const text = client.preprocessText ("abc![alt text](https://bad.com/this/is/terrible)def");
        expect(text).to.be.equal           ("abc. alt text.                                  def");
        const result = await client.analyzeSentiment(ort, text);
        expect(result.sentences[0].sentiment).to.be.equal("neutral");
    });

    it('Image tag 4', () => {
        const text = client.preprocessText ("abc![image1](abc)![image2](def)def");
        expect(text).to.be.equal           ("abc. image1.     . image2.     def");
    });

    it('Image tag 5', () => async () => {
        const text = client.preprocessText ("abc![I am good](https://good.com/)  ![You are bad](https://bad.com/)");
        expect(text).to.be.equal           ("abc. I am good.                       You are bad.                  ");
        const result = await client.analyzeSentiment(ort, ["abc![I am good](https://good.com/)","![You are bad](https://bad.com/)"]);
        expect(result.sentences[0].sentiment).to.be.equal("neutral");
        expect(result.sentences[1].sentiment).to.be.equal("negative");
    });

    it('Replace Backticks', async () => {
        const result = await client.analyzeSentiment(ort, "`Change the backticks`");
        expect(result.sentences[0].text).to.be.equal("\"Change the backticks\"");
    });

    it('Yield Example', async () => {
        const result = await client.analyzeSentiment(ort, "`yield` returning / breaking has benefits when there's a chance that you don't iterate through all items.");
        expect(result.sentences[0].confidenceScores.negative).to.be.lessThan(0.9);
    });

    it ('Split into sentences', () => {
        const result = client.splitIntoSentences(
`I love this.
Mister Smith bought cheapsite.com for 1.5 million dollars, i.e. he paid a lot for it. Did he mind? Adam Jones Jr. thinks he didn't. In any case, this isn't true... Well, with a probability of .9 it isn't.
Was I worried?
Nope.`
        );
        expect(result.length).to.be.equal(8);
        //TODO: eventually, should we need `.trim()`?
        expect(result[0].trim()).to.be.equal('I love this.');
        expect(result[1].trim()).to.be.equal('Mister Smith bought cheapsite.com for 1.5 million dollars, i.e. he paid a lot for it.');
        expect(result[2].trim()).to.be.equal('Did he mind?');
        expect(result[3].trim()).to.be.equal('Adam Jones Jr. thinks he didn\'t.');
        expect(result[4].trim()).to.be.equal('In any case, this isn\'t true...');
        expect(result[5].trim()).to.be.equal('Well, with a probability of .9 it isn\'t.');
        expect(result[6].trim()).to.be.equal('Was I worried?');
        expect(result[7].trim()).to.be.equal('Nope.');
    });
});