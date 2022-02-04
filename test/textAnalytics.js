describe('textAnalytics', () => {
    const client = require('../src-packed/textAnalytics');
    if (client.emptyApiKey)
        return;

    it('Negative', async () => {
        const result = await client.analyzeSentiment("This is terrible!");
        expect(result.sentences[0].sentiment).to.be.equal("negative");
    });

    it('Neutral', async () => {
        const result = await client.analyzeSentiment("Hello, World!");
        expect(result.sentences[0].sentiment).to.be.equal("neutral");
    });

    it('Positive', async () => {
        const result = await client.analyzeSentiment("This is great!");
        expect(result.sentences[0].sentiment).to.be.equal("positive");
    });

    it('Fenced code blocks negative', async () => {
        const result = await client.analyzeSentiment("```\nThis is terrible!\n```\nHello, World!\n");
        expect(result.sentences[0].sentiment).to.be.equal("neutral");
    });

    it('Fenced code blocks negative, offset', async () => {
        const text = "```\nHello, World!\n```\nThis is terrible!\n";
        const result = await client.analyzeSentiment(text);
        var sentence = result.sentences[0];
        expect(sentence.sentiment).to.be.equal("negative");
        expect(sentence.offset).to.be.equal(0);
        expect(sentence.length).to.be.equal(text.length - 1); // -1 is the \n
    });

    it('Indented code blocks negative', async () => {
        const result = await client.analyzeSentiment("    This is terrible!\nHello, World!\n");
        expect(result.sentences[0].sentiment).to.be.equal("neutral");
    });

    it('Indented code blocks negative, offset', async () => {
        const text = "This is terrible!\n    Hello, World!";
        const result = await client.analyzeSentiment(text);
        var sentence = result.sentences[0];
        expect(sentence.sentiment).to.be.equal("negative");
        expect(sentence.offset).to.be.equal(0);
        expect(sentence.length).to.be.equal("This is terrible!".length);
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

    it("Preprocess Ignorable sentence", () => {
        const text     = "These test failures can be ignored.";
        const expected = "These             s can be       d."
        const result = client.preprocessIgnorableNegativeText (text);
        expect(result).to.be.equal(expected);
    });

    it("Ignorable sentence", async () => {
        const result = await client.analyzeSentiment("I see a couple of new warnings and errors.");
        expect(result.sentences[0].sentiment).not.to.be.equal("negative");
    });

    it("Ignorable negative sentence", async () => {
        const result = await client.analyzeSentiment("There are some new test failures, this is terrible.");
        expect(result.sentences[0].sentiment).to.be.equal("negative");
    });

    it("Ignorable sentence and negative sentence, offset and length", async () => {
        const sen1 = "I see a new error in the build.";
        const sen2 = "This is the worst thing that has ever happened."
        const result = await client.analyzeSentiment(sen1 + " " + sen2);
        var res1 = result.sentences[0];
        var res2 = result.sentences[1];
        expect(res1.sentiment).not.to.be.equal("negative");
        expect(res2.sentiment).to.be.equal("negative");
        expect(res1.offset).to.be.equal(0);
        expect(res2.offset).to.be.equal(sen1.length + 1);
        expect(res1.length).to.be.equal(sen1.length);
        expect(res2.length).to.be.equal(sen2.length);
    });

    it('Image tag 1', () => {
        const text = client.preprocessText ("abc![image](abc)def");
        expect(text).to.be.equal           ("abc             def");
    });

    it('Image tag 2', () => async () => {
        const text = client.preprocessText ("abc![image](https://bad.com/this/is/terrible)def");
        expect(text).to.be.equal           ("abc                                          def");
        const result = await client.analyzeSentiment(text);
        expect(result.sentences[0].sentiment).to.be.equal("neutral");
    });

    it('Image tag 3', () => async () => {
        const text = client.preprocessText ("abc![alt text](https://bad.com/this/is/terrible)def");
        expect(text).to.be.equal           ("abc                                             def");
        const result = await client.analyzeSentiment(text);
        expect(result.sentences[0].sentiment).to.be.equal("neutral");
    });

    it('Image tag 4', () => {
        const text = client.preprocessText ("abc![image1](abc)![image2](def)def");
        expect(text).to.be.equal           ("abc                            def");
    });
});