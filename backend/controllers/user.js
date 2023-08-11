// backend/controllers/user.js

const { User, validate } = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { encrypt, decrypt } = require('../utils/confirmation')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const createTransporter = async () => {
  const {
    GMAIL_EMAIL,
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    OAUTH_REFRESH_TOKEN
  } = process.env

  const oauth2Client = new OAuth2(
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  )

  oauth2Client.setCredentials({
    refresh_token: OAUTH_REFRESH_TOKEN
  })

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject()
      }
      resolve(token)
    })
  })

  const Transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: GMAIL_EMAIL,
      accessToken,
      clientId: OAUTH_CLIENT_ID,
      clientSecret: OAUTH_CLIENT_SECRET,
      refreshToken: OAUTH_REFRESH_TOKEN
    }
  })

  return Transport
}

const sendEmail = async ({ email, username, res }) => {
  // Create a unique confirmation token
  const confirmationToken = encrypt(username)
  const apiUrl = process.env.API_URL || 'http://0.0.0.0:8080'

  // Initialize the Nodemailer with your Gmail credentials
  const Transport = await createTransporter()

  // Configure the email options
  const mailOptions = {
    from: 'Admin',
    to: email,
    subject: 'Email Confirmation',
    html: `Press the following link to verify your email: <a href=http://localhost:8080/verify/${confirmationToken}>Verification Link</a>`
  }

  // Send the email
  Transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      res.status(400).send(error)
    } else {
      res.status(201).json({
        message: 'Account created successfully, please verify your email.'
      })
    }
  })
}

const handleSignup = async (req, res) => {
  try {
    // Validate the user data
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const { firstName, lastName, username, email, password } = req.body // Get the user data

    // Check if the user exists in the database
    const oldUser = await User.findOne({ email })
    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login')
    }

    // Hash the password
    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create an user object
    let user = await User.create({
      firstName,
      lastName,
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    })

    // Create the user token
    const token = jwt.sign(
      { userId: user._id, email },
      process.env.TOKEN_SECRET_KEY,
      {
        expiresIn: '2h'
      }
    )
    user.token = token

    // Send the email verification link
    return sendEmail({ email, username, res })
  } catch (err) {
    console.error(err)
  }
}

// user will click the link in the email that we send them to verify their email
const handleVerifyEmail = async (req, res) => {
  try {
    // Get the confirmation token
    const { confirmationToken } = req.params

    // Decrypt the username
    const username = decrypt(confirmationToken)

    // Check if there is anyone with that username
    const user = await User.findOne({ username: username })

    if (user) {
      // If there is anyone, mark them as confirmed account
      user.isConfirmed = true
      await user.save()

      // Return the created user data
      res
        .status(201)
        .json({ message: 'User verified successfully', data: user })
    } else {
      return res.status(409).send('User Not Found')
    }
  } catch (err) {
    console.error(err)
    return res.status(400).send(err)
  }
}

// backend/controllers/user.js

const handleLogin = async (req, res) => {
  try {
    // Get user data
    const { emailOrUsername, password } = req.body

    // Validate user data
    if (!(emailOrUsername && password)) {
      res.status(400).send('All data is required')
    }

    // A regex expression to test if the given value is an email or username
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const data = regexEmail.test(emailOrUsername)
      ? {
          email: emailOrUsername
        }
      : {
          username: emailOrUsername
        }

    // Validate if user exist in our database
    const user = await User.findOne(data)

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const email = user.email
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_SECRET_KEY,
        {
          expiresIn: '2h'
        }
      )

      // save user token
      user.token = token

      // user
      res
        .status(200)
        .json({ email: user.email, token: user.token, username: user.username })
    } else {
      res.status(400).send('Invalid Credentials')
    }
  } catch (err) {
    console.error(err)
    return res.status(400).send(err.message)
  }
}

module.exports = {
  handleSignup,
  handleVerifyEmail,
  handleLogin
}
