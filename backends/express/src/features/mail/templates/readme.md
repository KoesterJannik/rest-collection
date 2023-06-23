You can use email templates from https://stripo.email for example
await mailer.sendEmail({
subject: "Hello from Node.js",
to: ["koesterjannik1998@gmail.com"],
templateName: "welcome.hbs",
templateData: {
name: "Jannik",
},
});
