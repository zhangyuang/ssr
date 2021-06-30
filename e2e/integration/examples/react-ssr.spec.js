/// <reference types="cypress" />

describe('React SSR', () => {
  it('Context can be shared between different component', () => {
    // context 状态能够被各个组件共享
    const text = 'Hello, World'
    cy.visit('http://localhost:3000')
    cy.get('input').type(text, { force: true })
    cy.get('.swiper-slide-active').first().click()
    cy.get('input').should('have.value', text)
    cy.get('input').type('new', { force: true })
    cy.go('back')
    cy.get('input').should('have.value', text + 'new')
  })
})
