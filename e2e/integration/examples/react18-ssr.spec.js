/// <reference types="cypress" />

describe('SSR', () => {
  it('SSR mode shoube be render successful', () => {
    cy.visit('http://localhost:3000')
    cy.wait(10000)
    cy.window()
      .its('__USE_SSR__')
      .should('equal', true)
    cy.contains('王牌对王牌 第五季').should('exist')
  })
  it('SSR mode detail Page shoube be render successful', () => {
    cy.visit('http://localhost:3000/detail/cbba934b14f747049187')
    cy.window()
      .its('__USE_SSR__')
      .should('equal', true)
    cy.contains('王牌对王牌 第五季').should('exist')
  })
  it('CSR mode shoube be render successful', () => {
    cy.visit('http://localhost:3000?csr=true')
    cy.window()
      .its('__USE_SSR__')
      .should('not.exist')
    cy.contains('王牌对王牌 第五季').should('exist')
  })
  it('CSR mode detail Page shoube be render successful', () => {
    cy.visit('http://localhost:3000/detail/cbba934b14f747049187?csr=true')
    cy.window()
      .its('__USE_SSR__')
      .should('not.exist')
    cy.contains('王牌对王牌 第五季').should('exist')
  })
})
