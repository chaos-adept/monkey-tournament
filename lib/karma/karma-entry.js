
mocha.setup({
    timeout: 20000,
    slow: 3000,
});

const chai = require('chai');
chai.should();
chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));
chai.use(require('chai-changes'));
var testsContext = require.context('./', true, /(\-spec)|(__spec)$/);
testsContext.keys().forEach(testsContext);
module.exports = testsContext;
