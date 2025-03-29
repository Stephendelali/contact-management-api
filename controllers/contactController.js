const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// @desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    // Only find contacts belonging to this user
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});

// @desc Create new contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async(req, res) => {
    const {name, email, phone} = req.body;
    
    // Ensure user_id comes from the validated token
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    });
    
    res.status(201).json(contact);
});

// @desc  GET contact
// @route GET /api/contacts/:id
// @access private
const getContact = asyncHandler(async (req, res) => {
    // Find contact AND verify it belongs to this user
    const contact = await Contact.findOne({
        _id: req.params.id,
        user_id: req.user.id
    });
    
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    
    res.status(200).json(contact);
});

// @desc  Update contact
//@route PUT /api/contacts/i
//@access private
const updateContact =asyncHandler(
    async(req, res) => {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            res.status(404);
            throw new Error("Contact not found !");
        }

        if (contact.user_id.toString() !== req.user.id) {
            res.status(403);
            throw new Error("You are not authorized to update this contact");
        }
         
        const updatedContact = await Contact.findByIdAndUpdate
            (
                req.params.id,
                req.body,
                { new: true}
            );

        res.status(200).json(updatedContact);
     }); 

// @desc  delete contact
//@route DELETE /api/contacts/i
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found!");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("You are not authorized to delete this contact");
    }

    await contact.deleteOne(); 
    res.status(200).json({ message: "Contact deleted", deletedContact: contact });
});

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact
 };
