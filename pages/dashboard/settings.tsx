import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: '/settings', permanent: true } };
};

export default function DashboardSettingsRedirect() {
  return null;
}
