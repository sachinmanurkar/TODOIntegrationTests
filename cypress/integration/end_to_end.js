describe('TodoMVC End-to-End Testing', function () {

    // setup these constants to match what TodoMVC does
    let TODO_ITEM_ONE = 'sweap the floor'
    let TODO_ITEM_TWO = 'buy milk'
    let TODO_ITEM_THREE = 'buy groceries from store'
  

    // runs before each test in the block
    beforeEach(function () {                                         
      cy.visit('https://todomvc.com/examples/typescript-react/')
    })
  
    context('When page is initially Loaded', function () {
      it('Should focus on the todo input field', function () {
        // get the currently focused element and assert
        // that it has class='new-todo'
        cy.focused().should('have.class', 'new-todo')
      })
    })
  
    context('When there are No Todos', function () {
      it('#main and #footer should be hidden', function () {
        cy.get('.todo-list li').should('not.exist')
        cy.get('.main').should('not.exist')
        cy.get('.footer').should('not.exist')
      })
    })
  
    context('When there are New Todo', function () {
      it('should allow me to add todo items', function () {
        // Create 1st todo
        cy.get('.new-todo').type(TODO_ITEM_ONE).type('{enter}')
  
        // Verify 1st label contains the 1st todo text
        cy.get('.todo-list li').eq(0).find('label').should('contain', TODO_ITEM_ONE)
  
        // Create 2nd todo
        cy.get('.new-todo').type(TODO_ITEM_TWO).type('{enter}')
  
        // Verify 2nd label contains the 2nd todo text
        cy.get('.todo-list li').eq(1).find('label').should('contain', TODO_ITEM_TWO)
      })
  
      it('adds items to todo', function () {
        // Add several todo items then check the number of items in the list
        cy.get('.new-todo')
        .type('todo ONE{enter}')
        .type('todo TWO{enter}') // we can continue working with same element
        .type('todo THREE{enter}') // and keep adding new items
        .type('todo FOUR{enter}')
        cy.get('.todo-list li').should('have.length', 4)
      })
  
      it('Text input field should be cleared when a item is added', function () {
        cy.get('.new-todo').type(TODO_ITEM_ONE).type('{enter}')
        cy.get('.new-todo').should('have.text', '')
      })

      it('#main and #footer Should be visible when a item is added', function () {
        cy.createTodo(TODO_ITEM_ONE)
        cy.get('.main').should('be.visible')
        cy.get('.footer').should('be.visible')
      })
    })
  
    context('Mark all TODO as completed', function () {
      beforeEach(function () {
        cy.createDefaultTodos().as('todos')
      })
  
      it('should allow me to mark all TODO items as completed', function () {
        cy.get('.toggle-all').check({force: true})
  
        // get each todo list and ensure its class is 'completed'
        cy.get('@todos').eq(0).should('have.class', 'completed')
        cy.get('@todos').eq(1).should('have.class', 'completed')
        cy.get('@todos').eq(2).should('have.class', 'completed')
      })
  
      it('should allow me to clear the complete state of all items', function () {
        // First check and then uncheck imeediatly
        cy.get('.toggle-all').check({force: true}).uncheck({force: true})
  
        cy.get('@todos').eq(0).should('not.have.class', 'completed')
        cy.get('@todos').eq(1).should('not.have.class', 'completed')
        cy.get('@todos').eq(2).should('not.have.class', 'completed')
      })
    })
  
    context('Item in TODO', function () {

      it('When a item is Added to TODO it should allow me to mark items as complete', function () {
        cy.createTodo(TODO_ITEM_ONE).as('firstTodo')
        cy.createTodo(TODO_ITEM_TWO).as('secondTodo')
  
        cy.get('@firstTodo').find('.toggle').check()
        cy.get('@firstTodo').should('have.class', 'completed')
  
        cy.get('@secondTodo').should('not.have.class', 'completed')
        cy.get('@secondTodo').find('.toggle').check()
  
        cy.get('@firstTodo').should('have.class', 'completed')
        cy.get('@secondTodo').should('have.class', 'completed')
      })
  
      it('should allow me to un-mark items as complete', function () {
        cy.createTodo(TODO_ITEM_ONE).as('firstTodo')
        cy.createTodo(TODO_ITEM_TWO).as('secondTodo')
  
        cy.get('@firstTodo').find('.toggle').check()
        cy.get('@firstTodo').should('have.class', 'completed')
        cy.get('@secondTodo').should('not.have.class', 'completed')
  
        cy.get('@firstTodo').find('.toggle').uncheck()
        cy.get('@firstTodo').should('not.have.class', 'completed')
        cy.get('@secondTodo').should('not.have.class', 'completed')
      })
  
      it('should allow me to edit an item', function () {
        cy.createDefaultTodos().as('todos')
        cy.createTodo(TODO_ITEM_ONE).as('firstTodo')
        cy.createTodo(TODO_ITEM_THREE).as('thirdTodo')

        cy.get('@todos').eq(1).as('secondTodo')
        .find('label').dblclick()
  
        // clear out the inputs current value
        // and type a new value
        cy.get('@secondTodo').find('.edit').clear()
        .type('buy some sausages').type('{enter}')
  
        // assert about the text value
        cy.get('@firstTodo').eq(0).should('contain', TODO_ITEM_ONE)
        cy.get('@secondTodo').should('contain', 'buy some sausages')
        cy.get('@thirdTodo').eq(0).should('contain', TODO_ITEM_THREE)
      })
    })
  
    context('Editing', function () {
      beforeEach(function () {
        cy.createDefaultTodos().as('todos')
      })
  
      it('When editing other control should be hidden', function () {
        cy.get('@todos').eq(1).as('secondTodo')
        .find('label').dblclick()
  
        cy.get('@secondTodo').find('.toggle').should('not.be.visible')
        cy.get('@secondTodo').find('label').should('not.be.visible')
  
      })
  
      it('should save edits on blur', function () {
        cy.createTodo(TODO_ITEM_ONE).as('firstTodo')
        cy.createTodo(TODO_ITEM_THREE).as('thirdTodo')

        cy.get('@todos').eq(1).as('secondTodo')
        .find('label').dblclick()
  
        cy.get('@secondTodo')
        .find('.edit').clear()
        .type('buy some sausages')
        .blur()
  
        cy.get('@firstTodo').eq(0).should('contain', TODO_ITEM_ONE)
        cy.get('@secondTodo').should('contain', 'buy some sausages')
        cy.get('@thirdTodo').eq(0).should('contain', TODO_ITEM_THREE)
      })
      
      it('should remove the item if an empty text string was entered', function () {
        cy.get('@todos').eq(1).as('secondTodo')
        .find('label').dblclick()
  
        cy.get('@secondTodo')
        .find('.edit').clear().type('{enter}')
  
        cy.get('@todos').should('have.length', 2)
      })
  
      it('On escape the edits should be cancelled', function () {
        cy.get('@todos').eq(1).as('secondTodo')
        .find('label').dblclick()
  
        cy.get('@secondTodo')
        .find('.edit').clear().type('foo{esc}')
  
        cy.createTodo(TODO_ITEM_ONE).as('firstTodo')
        cy.createTodo(TODO_ITEM_TWO).as('secondTodo')
        cy.createTodo(TODO_ITEM_THREE).as('thirdTodo')

        cy.get('@firstTodo').eq(0).should('contain', TODO_ITEM_ONE)
        cy.get('@secondTodo').eq(0).should('contain', TODO_ITEM_TWO)
        cy.get('@thirdTodo').eq(0).should('contain', TODO_ITEM_THREE)
      })
    })
  
    context('Count the number of items in TODO(Counter)', function () {
      it('Display the current number of todo items', function () {
        cy.createTodo(TODO_ITEM_ONE)
        cy.get('.todo-count').contains('1 item left')
        cy.createTodo(TODO_ITEM_TWO)
        cy.get('.todo-count').contains('2 items left')
      })
    })
  
    context('Clear completed button', function () {
      beforeEach(function () {
        cy.createDefaultTodos().as('todos')
      })
  
      it('Text should be displayed correctly', function () {
        cy.get('@todos').eq(0).find('.toggle').check()
        cy.get('.clear-completed').contains('Clear completed')
      })
  
      it('When there are no items that are completed TODO should be hidden', function () {
        cy.get('@todos').eq(1).find('.toggle').check()
        cy.get('.clear-completed').should('be.visible').click()
        cy.get('.clear-completed').should('not.exist')
      })
    })
  
    context('Routing', function () {

      beforeEach(function () {
        cy.createDefaultTodos().as('todos')
      })
  
      it('should respect the back button', function () {
        cy.get('@todos').eq(1).find('.toggle').check()
        cy.get('.filters').contains('Active').click()
        cy.get('.filters').contains('Completed').click()
        cy.get('@todos').should('have.length', 1)
        cy.go('back')
        cy.get('@todos').should('have.length', 2)
        cy.go('back')
        cy.get('@todos').should('have.length', 3)
      })
  
      it('should allow me to display completed items', function () {
        cy.get('@todos').eq(1).find('.toggle').check()
        cy.get('.filters').contains('Completed').click()
        cy.get('@todos').should('have.length', 1)
      })
  
      it('should allow me to display all items', function () {
        cy.get('@todos').eq(1).find('.toggle').check()
        cy.get('.filters').contains('Active').click()
        cy.get('.filters').contains('Completed').click()
        cy.get('.filters').contains('All').click()
        cy.get('@todos').should('have.length', 3)
      })
    })
  })