let {pool: pool} = require('../db');
const Stripe = require("stripe");


const stripe = new Stripe("sk_test_51OueggSC4tZo71faRJExWCUe7F6GOgvFWbWMhX9colXhHR0J0e8dvzDP5sfZbiaP6zmGaVvmOfNOpVMexiCNRynf00di1dsUpY");


exports.checkout = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100, // Amount in paise
          },
          quantity: item.quantity,
        };
      }),
      customer_email: req.body.customer_email, // Required for Indian regulations
      billing_address_collection: "required", // Collects billing address
      shipping_address_collection: {
        allowed_countries: ["IN"], // Restrict to India or add more countries as needed
      },
      success_url: "http://localhost:3000/dashboard",
      cancel_url: "http://localhost:3000/cancel",
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

const webhookSecret = 'whsec_77rCxrpUVLkqXOf91FYtxRxNUNIShA0x';

exports.stripeWebhook = async (req, res) => {
  const endpointSecret = webhookSecret; // Correctly set webhook secret
  const sig = req.headers["stripe-signature"];

  let event;
  
  try {
    // Verify the event using raw body
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("Webhook signature verification successful");
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const email = session.customer_details.email; // Use the email from the session to identify the user
      console.log(session);  
            try {
                // Update the user's type in the database to 'premium'
                const result = await pool.query(
                    'UPDATE users SET usertype = $1 WHERE email = $2 RETURNING *',
                    ['premium', email]
                );

                if (result.rowCount === 0) {
                    console.error(`User with email ${email} not found in database.`);
                } else {
                    console.log(`User with email ${email} upgraded to premium.`);
                }
            } catch (dbErr) {
                console.error("Database error:", dbErr.message);
            }

            console.log("Payment successful for session:", session.id);
            console.log("Customer email:", email);
            console.log("Amount total (paise):", session.amount_total);
            break;

    case "payment_intent.payment_failed":
      const failedIntent = event.data.object;
      console.error("Payment failed:", failedIntent.last_payment_error.message);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};
// Create Task
exports.createTask = async (req, res) => {
    const { title, description, assigned_to ,created_by} = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, description, assigned_to, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, assigned_to, created_by]
        );
        res.status(201).json({ task: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Tasks for User
// exports.getTasks = async (req, res) => {

//     const userId = req.query.userId; // Get userId from query parameters
//     console.log(userId);
//     if (!userId) {
//         return res.status(400).json({ error: 'User ID is required' });
//     }
//     try {
//         const result = await pool.query('SELECT * FROM tasks WHERE assigned_to = $1', [userId]);
//         res.json({ tasks: result.rows });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };


exports.getAllTasksForManager = async (req, res) => {
  try {
    // Query all tasks with details about assigned_to and created_by
    const result = await pool.query(
      `SELECT 
         tasks.id, 
         tasks.title, 
         tasks.description, 
         tasks.status, 
         tasks.created_by, 
         tasks.assigned_to, 
         creator.name AS createdBy, 
         assignee.name AS assignedTo
       FROM tasks
       JOIN users AS creator ON tasks.created_by = creator.id
       LEFT JOIN users AS assignee ON tasks.assigned_to = assignee.id`
    );

    res.json({ tasks: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get Tasks for User
exports.getTasks = async (req, res) => {
    const userId = req.query.userId; // Get userId from query parameters
  
    console.log(userId); // This should print the userId
  
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    try {
      const result = await pool.query(
        `SELECT tasks.*, users.name AS createdBy FROM tasks 
         JOIN users ON tasks.created_by = users.id
         WHERE tasks.assigned_to = $1`,
        [userId]
      );
      // console.log(result.rows);
      res.json({ tasks: result.rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
// Update Task Status
// Update Task Status
exports.updateTaskStatus = async (req, res) => {
  const { taskId, status } = req.body; // Extract taskId and status from the request body

  if (!taskId || !status) {
    return res.status(400).json({ error: 'Task ID and status are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, taskId]
    );
    res.json({ task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
