// adapted from https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/
Cypress.Commands.add('findInIframe', selector =>
    // get the iframe > document > body
    // and retry until the body element is not empty
    cy
        .get('iframe[#result]', { log: false })
        .its('0.contentDocument.body', { log: false })
        .should('not.be.empty')
        // wraps "body" DOM element to allow
        // chaining more Cypress commands, like ".find(...)"
        // https://on.cypress.io/wrap
        .then(body => cy.wrap(body, { log: false }).find(selector))
);

Cypress.Commands.add('setupBoard', seed => {
    cy.get('input#number').type(seed).get('button').contains(/play/i).click();
});
