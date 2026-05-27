import UI_IMG from '../../assets/images/auth-img.png';

function AuthLayout({ children }) {
  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#f8fafc] overflow-hidden">
      <div className="md:w-[60%] flex items-center justify-center p-3 md:p-5 overflow-hidden">
        <div className="w-full h-full max-w-xl">
          {children}
        </div>
      </div>

      <div className="hidden md:flex md:w-[40%] items-center justify-center bg-[#eef4ff] p-0 h-full overflow-hidden">
        <img
          src={UI_IMG}
          alt="Task Manager illustration"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export default AuthLayout;