import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const UsersSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: false },
    role: { type: String, enum: ["Guest", "Host"], default: "Guest" },
    accomodation: [{ type: Schema.Types.ObjectId, ref: "Accomodation" }],
  },
  { timestamps: true }
);

UsersSchema.pre("save", async function (next) {
  const currentUser = this;

  if (currentUser.isModified("password")) {
    const plainPW = currentUser.password;
    const hash = await bcrypt.hash(plainPW, 10);
    currentUser.password = hash;
  }

  next();
});

UsersSchema.methods.toJSON = function () {
  const userDocument = this;
  const user = userDocument.toObject();

  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.__v;
  return user;
};

UsersSchema.static("checkCredentials", async function (email, password) {
  const user = await this.findOne({ email });
  console.log("USER:", user);

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD:", passwordMatch);

    if (passwordMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
});

export default model("User", UsersSchema);
