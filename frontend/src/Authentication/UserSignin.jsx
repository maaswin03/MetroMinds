import { SignIn } from '@clerk/clerk-react';

function UserSignin(){
  return (
    <div>
      <div className='login1'>
        <SignIn signUpUrl="/signup" />
      </div>
    </div>
  );
};

export default UserSignin;