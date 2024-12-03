require('dotenv').config()
const mongoose = require('mongoose')
const CustomerModel = require('./models/customer')
const prompt = require('prompt-sync')()

const connectToDb = async () => {
  await mongoose.connect(process.env.MONGO_URI)
}

const askForUsername = () => {
  prompt('What is your name? ')
}

const showMenu = () => {
  console.log("\nPlease choose an action from the menu below:\n")
  console.log("1. Add a new customer")
  console.log("2. Display all customers")
  console.log("3. Modify customer information")
  console.log("4. Remove a customer")
  console.log("5. Exit\n")

  const actionChoice = prompt("Enter the number corresponding to your choice: ")
  return parseInt(actionChoice)
}

const addCustomer = async () => {
  const customerName = prompt("Enter the name of the customer: ")
  const customerAge = prompt("Enter the age of the customer: ")
  await CustomerModel.create({ name: customerName, age: customerAge })
}

const displayAllCustomers = async () => {
  const customers = await CustomerModel.find()
  if (customers.length > 0) {
    customers.forEach(customer => {
      console.log(`ID: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`)
    })
  }
}

const modifyCustomer = async () => {
  const customerId = prompt("Enter the ID of the customer you wish to update: ")
  const updatedName = prompt("Enter the new name for the customer: ")
  const updatedAge = prompt("Enter the new age for the customer: ")

  await CustomerModel.findByIdAndUpdate(customerId, { name: updatedName, age: updatedAge }, { new: true })
}

const removeCustomer = async () => {
  const customerId = prompt("Enter the ID of the customer you wish to delete: ")
  await CustomerModel.findByIdAndDelete(customerId)
}

const processUserChoice = async () => {
  let action = showMenu()

  while (action !== 5) {
    switch (action) {
      case 1:
        await addCustomer()
        break
      case 2:
        await displayAllCustomers()
        break
      case 3:
        await modifyCustomer()
        break
      case 4:
        await removeCustomer()
        break
    }

    action = showMenu()
  }

  mongoose.connection.close()
}

connectToDb()
    askForUsername()
    processUserChoice()
  
