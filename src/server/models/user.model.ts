import mongoose from "mongoose"
import bcrypt from "bcrypt"


export type User = {
  fullname: string,
  username: string,
  email: string,
  password: string
}

export type UserDocument = User & mongoose.Document & {
  comparePassword: ( password: string ) => Promise<boolean>
}


const userSchema: mongoose.Schema<UserDocument> = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.pre("save", async function( next ){
  if ( !this.isModified("password") ) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(this.password, salt)
  this.password = hash

  return next() 
})

userSchema.methods.comparePassword = async function(password: string) {
  
  try {
    return await bcrypt.compare(password, this.password)
  } catch( error ) {
    return false
  }
}

const userModel: mongoose.Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>("User", userSchema)

export { userModel }