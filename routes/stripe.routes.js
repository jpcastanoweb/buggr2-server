const express = require("express")
const router = express.Router()
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)

router.post

router.post("/create-customer", async (req, res) => {
  console.log("entering create customer")
  try {
    const { firstName, lastName, email } = req.body
    await stripe.customers
      .create({
        description: "My First Test Customer (created for API docs)",
        email: email,
        name: firstName + lastName ? lastName : "",
      })
      .then((response) => {
        console.log("finished create from stripe")
        return response.json()
      })
      .then((result) => {
        // result.customer.id is used to map back to the customer object
        return result
      })
  } catch (error) {}
})

router.post("/webhook", async (req, res) => {
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.log(err)
    console.log(`⚠️  Webhook signature verification failed.`)
    console.log(`⚠️  Check the env file and enter the correct webhook secret.`)
    return res.sendStatus(400)
  }
  // Extract the object from the event.
  const dataObject = event.data.object

  // Handle the event
  // Review important events for Billing webhooks
  // https://stripe.com/docs/billing/webhooks
  // Remove comment to see the various objects sent for this sample
  switch (event.type) {
    case "invoice.paid":
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your
      // database to reference when a user accesses your service to avoid hitting rate limits.
      break
    case "invoice.payment_failed":
      // If the payment fails or the customer does not have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      break
    case "customer.subscription.deleted":
      if (event.request != null) {
        // handle a subscription cancelled by your request
        // from above.
      } else {
        // handle subscription cancelled automatically based
        // upon your subscription settings.
      }
      break
    default:
    // Unexpected event type
  }
  res.sendStatus(200)
})

router.post("/create-session", async (req, res) => {
  const { userid, price } = req.body

  try {
    const response = await stripe.checkout.sessions.create({
      success_url:
        process.env.CLIENT_URL +
        "/subscribe/successful-session?session_id={CHECKOUT_SESSION_ID}",
      cancel_url:
        process.env.CLIENT_URL +
        "/subscribe/failed-session?session_id={CHECKOUT_SESSION_ID}",
      payment_method_types: ["card"],
      line_items: [{ price, quantity: 1 }],
      client_reference_id: userid,
      mode: "subscription",
    })
    console.log(response.url)
    res.json(response.url)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error, msg: "Something happened" })
  }
})

router.get("/request-session/:sessionid", async (req, res) => {
  const { sessionid } = req.params
  try {
    const foundSession = await stripe.checkout.sessions.retrieve(sessionid)
    console.log("Found Session", foundSession)

    res.json(foundSession)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/request-subscription/:subscriptionid", async (req, res) => {
  const { subscriptionid } = req.params
  try {
    const foundSubscription = await stripe.subscriptions.retrieve(
      subscriptionid
    )
    console.log("Found Subscription", foundSubscription)

    res.json(foundSubscription)
  } catch (error) {
    res.status(400).json(error)
  }
})

module.exports = router
