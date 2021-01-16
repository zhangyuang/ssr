/// <reference types="cypress" />

describe('SSR', () => {
  it('SSR mode shoube be render successful', () => {
    cy.visit('http://localhost:3000')
    cy.get('.swiper-slide').should('exist')
    cy.get('.swiper-slide').first().click()
    cy.contains('王牌对王牌 第五季').should('exist')
    cy.window()
      .its('__USE_SSR__')
      .should('equal', true)
  })
  it('CSR mode shoube be render successful', () => {
    cy.visit('http://localhost:3000?csr=true')
    cy.get('.swiper-slide').should('exist')
    cy.get('.swiper-slide').first().click()
    cy.contains('王牌对王牌 第五季').should('exist')
    cy.window()
      .its('__USE_SSR__')
      .should('not.exist')
  })
})
