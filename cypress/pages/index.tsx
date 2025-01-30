import Head from "next/head";
import Image from "next/image";
import { Form, Input } from "react-hook-form-components";
import styles from "../styles/Home.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Col, Row } from "reactstrap";

// https://justin.poehnelt.com/posts/strongly-typed-yup-schema-typescript/
type ConditionalSchema<T> = T extends string
  ? yup.StringSchema
  : T extends number
    ? yup.NumberSchema
    : T extends boolean
      ? yup.BooleanSchema
      : T extends Array<unknown>
        ? yup.ArraySchema<never, never>
        : T extends Record<never, never>
          ? yup.AnyObjectSchema
          : yup.AnySchema;

type StronglyTypedShape<Fields> = {
  [Key in keyof Fields]: ConditionalSchema<Fields[Key]>;
};

interface FormData {
  username: string;
}

const schema = yup.object<StronglyTypedShape<FormData>>({
  username: yup.string().required(),
});

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <p>
          This example was created using npx create-next-app and serves the purpose of running cypress component tests.
          <br /> It can also be used to test local development.
        </p>

        <Row>
          <Col>
            <div>
              <Form<FormData> onSubmit={(data) => alert(JSON.stringify(data, undefined, 2))} resolver={yupResolver(schema)}>
                <Input<FormData> name="username" label={"Username"} />

                <input type="submit" />
              </Form>
            </div>
          </Col>
        </Row>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
