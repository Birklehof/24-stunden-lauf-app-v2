import CustomErrorPage from './_error';

export default function Custom500() {
  return <CustomErrorPage statusCode={500} />;
}