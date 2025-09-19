import CustomErrorPage from './_error';

export default function Custom404() {
  return <CustomErrorPage statusCode={404} />;
}