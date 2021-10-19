
/// <reference types="cypress" />

describe('React SSR dynamic router', () => {
  it('dynamic router will only match one route', () => {
    cy.visit('http://localhost:3000/login')
  })
  it('zh page can be render succeed', () => {
    cy.visit('http://localhost:3000/zh')
  })
  it('en page can be render succeed', () => {
    cy.visit('http://localhost:3000/en')
  })
})
