import { SignIn } from '@clerk/clerk-react';
import './Signin.css';
import Navbar from '@/AddedWidget/Navbar';

const Signin: React.FC = () => {

    return (
        <div>
            <Navbar />
            <div className='login1'>
                <SignIn />
            </div>
        </div>
    );
};

export default Signin;
