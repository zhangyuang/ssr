/// <reference types="cypress" />

describe('SSR', () => {
  it('SSR mode shoube be render successful', () => {
    cy.visit('http://localhost:3000')
    cy.window()
      .its('__USE_SSR__')
      .should('equal', true)
    cy.get('.swiper-slide-active').should('exist')
    cy.get('.swiper-slide-active').first().click()
    cy.contains('王牌对王牌 第五季').should('exist')
    cy.go('back') // 路由 回退 上一个页面 需要能被正常渲染
    cy.get('.swiper-slide-active').should('exist')
  })
  it('CSR mode shoube be render successful', () => {
    cy.visit('http://localhost:3000?csr=true')
    cy.window()
      .its('__USE_SSR__')
      .should('not.exist')
    cy.get('.swiper-slide-active').should('exist')
    cy.get('.swiper-slide-active').first().click()
    cy.contains('王牌对王牌 第五季').should('exist')
    cy.go('back')
    cy.get('.swiper-slide-active').should('exist')
  })
  it('Context can be shared between different component', () => {
    // context 状态能够被各个组件共享
    const text = 'Hello, World'
    cy.visit('http://localhost:3000')
    cy.get('input').type(text)
    cy.get('.swiper-slide-active').first().click()
    cy.get('input').should('have.value', text)
    cy.get('input').type('new')
    cy.go('back')
    cy.get('input').should('have.value', text + 'new')
  })
})
