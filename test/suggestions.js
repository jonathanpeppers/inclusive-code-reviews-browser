describe('suggestions', () => {
    const client = require('../src-packed/suggestions');

    it('No match', async () => {
        var result = client.getSuggestions("This code is amazing!");
        expect(result.length).to.be.equal(0);
    });

    it('Match at beginning', async () => {
        var result = client.getSuggestions("Terrible code!");
        expect(result[0]).to.eql({
            index: 0,
            length: 8,
            replacements: [ { value: "terrible" }, { value: "not so great" } ],
        });
    });

    it('Match at end', async () => {
        var result = client.getSuggestions("This is terrible");
        expect(result[0]).to.eql({
            index: 8,
            length: 8,
            replacements: [ { value: "terrible" }, { value: "not so great" } ],
        });
    });

    it('Match in the middle', async () => {
        var result = client.getSuggestions("Ship this to the master branch!");
        expect(result[0]).to.eql({
            index: 17,
            length: 6,
            replacements: [ { value: "master" }, { value: "main" } ],
        });
    });
});