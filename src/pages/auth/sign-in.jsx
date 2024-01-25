import {

  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    try {
      // Replace the following URL with your actual login API endpoint
      const response = await axios.post('https://fx.wl-solutions.net/api/v1/login', {
        email,
        password,
      });

      const { user, token } = response.data.data;

      // Save user and token in session storage
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('token', token);

      if (keepSignedIn) {
        // Optionally, save user and token in local storage for persistent login
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
      }

      // Redirect to a protected route or home page after successful login
      navigate('/dashboard/home');
    } catch (error) {
      console.error('Error during sign-in:', error);
      setError('Please check your email and password');
      // Handle login error (show error message, etc.)
    }
  };
  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          {error && <p className="bg-red-400 text-white rounded-md w-fit mx-auto px-8 py-4 mb-5">{error}</p>}
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                Keep me signed in
              </Typography>
            }
            checked={keepSignedIn}
            onChange={() => setKeepSignedIn(!keepSignedIn)}
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button className="mt-6" fullWidth onClick={handleSignIn}>
            Sign In
          </Button>

        
        
        </form>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>

    </section>
  );
}

export default SignIn;
