import React from "react";
import { useParams } from "react-router-dom";
import ResetPassword from "./ResetPassword";

const ResetPasswordPage = () => {
  const { token } = useParams();
  return <ResetPassword token={token} />;
};

export default ResetPasswordPage;
