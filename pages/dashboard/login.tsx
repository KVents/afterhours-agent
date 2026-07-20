import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: '/login', permanent: true } };
};

export default function DashboardLoginRedirect() {
  return null;
}
