import { Navigate, useLocation, useParams, useSearchParams } from "react-router-dom";

export const Callback = () => {
    const { hash } = useLocation();
    const params = new URLSearchParams(hash.substring(1));
    const paramsJson = {};
    for (const [key, value] of params.entries()) {
        paramsJson[key] = value;
    }
    localStorage.setItem('user_token', paramsJson.access_token);
  return (
    <Navigate to='/' />
  )
}
