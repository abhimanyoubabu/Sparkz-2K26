import EventDetailsPage from "@/widgets/event/EventDetailsPage";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  return <EventDetailsPage eventId={id} />;
};

export default page;
