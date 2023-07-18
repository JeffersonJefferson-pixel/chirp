import Head from "next/head";
import { api } from "~/utils/api";
import type { GetStaticProps, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { PostView } from "~/components/postview";


const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.posts.getById.useQuery({
    id,
  });

  if (isLoading) {
    console.log("is loading");
    return <div>Loading...</div>;
  }

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - ${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export default SinglePostPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
