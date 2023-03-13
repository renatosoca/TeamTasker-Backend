/* userModel.pre('save', function ( this: User, next ) {
  if ( !this.isModified( 'password ') ) return next();

  const salt = bcrypt.genSaltSync( 10 );
  this.password = bcrypt.hashSync( this.password, salt );
  next();
})

userModel.methods.comparePassword = function ( this: User, password: string ) {
  return bcrypt.compareSync( password, this.password );
} */