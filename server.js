const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const dbConnection = require("./config/database");

const NewsRouter = require("./routes/newsRoute");
const ContactRouter = require("./routes/contactusRoute");
const EventRouter = require("./routes/eventRoute");
const MatchRouter = require("./routes/matchRoute");
const InvestmentRouter = require("./routes/investmentRoute");
const MembershipRouter = require("./routes/membershipRoute");
const TeamMemberRouter = require("./routes/teamMemberRoute");
const TeamRouter = require("./routes/teamRoute");
const AuthRouter = require("./routes/authRoute");

dotenv.config({ path: path.join(__dirname, "config.env") });

dbConnection();

const app = express();



app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use("/api/news", NewsRouter);
app.use("/api/contact", ContactRouter);
app.use("/api/event", EventRouter);
app.use("/api/match", MatchRouter);
app.use("/api/investment", InvestmentRouter);
app.use("/api/membership", MembershipRouter);
app.use("/api/teamMember", TeamMemberRouter);
app.use("/api/team", TeamRouter);
app.use("/api/auth", AuthRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
