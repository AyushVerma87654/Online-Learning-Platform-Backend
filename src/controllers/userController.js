import fetch from "node-fetch";
import { UserModel } from "../models/userModel.js";
import Stripe from "stripe";
import { convertKeysToCamelCase } from "../services/normalizeData.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const signup = async (req, res) => {
  const { email, password, role, name } = req.body;
  try {
    const { data: authData, error } = await UserModel.createAuthUser(
      email,
      password
    );
    if (error) return res.status(400).json({ error: error.message });

    const { data, error: userTableError } = await UserModel.createUser({
      id: authData.user.id,
      name,
      email,
      role,
      is_premium_user: false,
    });

    if (userTableError) {
      await UserModel.deleteAuthUser(authData.user.id);
      return res.status(400).json({ error: userTableError.message });
    }
    const { data: sessionData, error: sessionError } =
      await UserModel.loginUser(email, password);
    if (sessionError)
      return res.status(400).json({ error: sessionError.message });

    const { access_token, refresh_token } = sessionData.session;

    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ responseDetails: { user: data[0], accessToken: access_token } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await UserModel.loginUser(email, password);
    if (error) return res.status(400).json({ error: error.message });
    const { access_token, refresh_token } = data.session;
    const { data: userData } = await UserModel.getUserById(data.user.id);
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      responseDetails: { user: userData, accessToken: access_token },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchMe = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ error: "No refresh token found" });
    const response = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: process.env.SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );
    const data = await response.json();
    const user = await UserModel.getUserById(data.user.id);
    if (!response.ok)
      return res
        .status(response.status)
        .json({ error: data.error_description });
    res.json({
      responseDetails: {
        user: convertKeysToCamelCase(user.data),
        accessToken: data.access_token,
      },
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });
  return res.json({ responseDetails: { message: "User Logged Out" } });
};

export const fetchAllUsers = async (req, res) => {
  try {
    const { data, error } = await UserModel.getAllUsers();
    if (error) return res.status(400).json({ error: error.message });
    res.json({
      responseDetails: { allUsers: data },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const paymentCheckout = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Practice Payment",
            },
            unit_amount: 5000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        "https://online-learning-platform-frontend.netlify.app/payment/success",
      cancel_url:
        "https://online-learning-platform-frontend.netlify.app/payment/cancel",
    });

    res.json({ responseDetails: { url: session.url } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const paymentWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return res.sendStatus(400);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    // ✅ Payment succeeded
    const session = event.data.object;
    console.log("✅ Payment success:", session);
    console.log(
      "session.customer_details.email",
      session.customer_details.email
    );
    console.log(
      "typeof session.customer_details.email",
      typeof session.customer_details.email
    );
    const { data: userData, error: userError } = await UserModel.getUserByEmail(
      session.customer_details.email
    );
    console.log("userData", userData);
    console.log("userError", userError);
    const { data, error } = await UserModel.setPremiumUser(
      session.customer_details.email
    );
    if (error) return res.status(400).json({ error });
    return res.json({ responseDetails: { user: data } });
  } else {
    return res.json({
      responseDetails: { message: `Unhandled event type ${event.type}` },
    });
  }
};
