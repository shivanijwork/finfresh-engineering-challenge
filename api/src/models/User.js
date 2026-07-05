import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },

        passwordHash: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        budgetGoals: {
            monthlyLimit: {
                type: Number,
                default: 0,
            },
            savingsGoal: {
                type: Number,
                default: 0,
            },
            debtGoal: {
                type: Number,
                default: 0,
            },
            debtPayoffDate: {
                type: Date,
                default: null,
            },
            cycleStartDay: {
                type: Number,
                default: 1,
                min: 1,
                max: 28,
            },
            categoryBudgets: {
                type: Map,
                of: Number,
                default: {},
            },
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {

  if (!this.isModified("passwordHash")) {
    return;
  }

  this.passwordHash = await bcrypt.hash(
    this.passwordHash,
    10
  );
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

const User = mongoose.model("User", userSchema);

export default User;