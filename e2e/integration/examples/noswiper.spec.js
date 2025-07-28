/// <reference types="cypress" />

describe('SSR', () => {
  it('SSR mode shoube be render successful', () => {
    cy.visit('http://localhost:3000')
    cy.wait(10000)
    cy.window()
      .its('__USE_SSR__')
      .should('equal', true)
  })
  it('SSR mode detail Page shoube be render successful', () => {
    cy.visit('http://localhost:3000/detail/cbba934b14f747049187')
    cy.window()
      .its('__USE_SSR__')
      .should('equal', true)
  })
  it('CSR mode shoube be render successful', () => {
    cy.visit('http://localhost:3000?csr=true')
    cy.window()
      .its('__USE_SSR__')
      .should('not.be.true')
  })
  it('CSR mode detail Page shoube be render successful', () => {
    cy.visit('http://localhost:3000/detail/cbba934b14f747049187?csr=true')
    cy.window()
      .its('__USE_SSR__')
      .should('not.be.true')
  })
})
