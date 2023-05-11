const { model, Schema } = require("mongoose");
 
let ticketSchema = new Schema({
    Guild: String,
    Channel: String,
    Ticket: String,
    Handler: String,
    TicketLog: String
});
 
module.exports = model("ticketSchema", ticketSchema);