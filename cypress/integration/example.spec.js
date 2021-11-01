it('Player X wins a game', () => {
    cy.visit('/')
        .findInIframe('input#number')
        .type('3')
        .findInIframe('button')
        .contains(/play/i)
        .click()

        // we can use the column and row attributes to implicitly test
        // the shape of the board
        .findInIframe('td[data-column="0"][data-row="0"]')
        .click()
        .should('match', /x/i)
        // or just grab the IDs of the data cells directly
        .findInIframe('td#0')
        .click()
        .should('match', /o/i)
        .findInIframe('td[data-column="0"][data-row="1"]')
        .click()
        .should('match', /x/i)
        .findInIframe('td#4')
        .click()
        .should('match', /o/i)
        .findInIframe('td[data-column="0"][data-row="2"]')
        .click()
        .should('match', /x/i)

        .findInIframe('#endgame')
        // X went first and went straight down, so X wins. This won't pass because
        // of the bug that's declaring the next player the winner
        .should(
            'contain',
            "Congratulations player X! You've won. Refresh to play again!"
        );
});

const drawSequence = [1, 2, 3, 7, 8, 9, 4, 5, 6];

it('End a game in a draw', () => {
    // using codepen's debug view pops the app out of the iframe so we don't have
    // to have Cypress work around that.
    cy.visit(`${Cypress.config('debugUrl')}`)
        // we'll move these next 5 commands into a separate command to start a game
        // if we keep wanting to play on 3x3 boards
        .get('input#number')
        .type('3')
        .get('button')
        .contains(/play/i)
        .click()
        .then(() => {
            drawSequence.forEach(position => {
                cy.get(position).click();
            });
        })
        // draw isn't implemented as an end state right now so this won't pass
        .get('#endgame')
        .should('contain', 'draw!');
});

const boardSizes = [3, 5, 7];

boardSizes.forEach(n => {
    it(`Playable board is a ${n}-squared cube`, () => {
        cy.visit(`${Cypress.config('debugUrl')}`)
            // custom command to move the repetitive setup out of the way
            .setupBoard(n)

            // row is n spaces long
            .get('tr td[data-row="0"]')
            .then(row => {
                cy.wrap(row).should('have.length', n);
            })
            // column is n spaces long
            .get('tr td[data-column="0"]')
            .then(column => {
                cy.wrap(column).should('have.length', n);
            })
            // total cell count is n-squared
            .get('table td')
            .then(cells => {
                cy.wrap(cells).should('have.length', n * n);
            });
    });
});
