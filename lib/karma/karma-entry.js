
mocha.setup({
    timeout: 20000,
    slow: 3000,
});

const chai = require('chai');
chai.should();
chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));
chai.use(require('chai-changes'));
var testsContext = require.context('../client', true, /(\--spec)$/);
testsContext.keys().forEach(function(path) {
    try {
        console.log(path);
        testsContext(path);
    } catch(err) {
        console.error('[ERROR] WITH SPEC FILE: ', path);
        console.error(err);
    }
});
module.exports = testsContext;
