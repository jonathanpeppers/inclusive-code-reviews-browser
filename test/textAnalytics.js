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
});