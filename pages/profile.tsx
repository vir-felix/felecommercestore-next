import { withSessionSsr } from "@Lib/withSession";
import Image from "next/image";
import { User } from "@prisma/client";
import prisma from "@Lib/prisma";
import { ChangeEvent, useState } from "react";
import { cloudinaryUpload } from "@Lib/utils";
import { phoneRegExp, userSchema } from "@Lib/validations";
import TextField from "@Components/common/formControls/TextField";
import Button from "@Components/common/formControls/Button";
import Form from "@Components/Form";

export default function Profile({ user }: { user: User }) {
  const [img, setImg] = useState("/assets/images/user-avatar.jpg");

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    // cloudinaryUpload(e.target.files, (r) => setImg(r[0]?.secure_url));
  };

  return (
    <div className="profile">
      <div className="profile__avatar">
        <Image
          objectFit="cover"
          src={user.avatarURL || img}
          width={200}
          height={200}
          alt="profile"
        />
        <button>Edit</button>
      </div>

      <form action="">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <Button type="submit">Upload New Avatar</Button>
      </form>

      <br />

      <Form action={`/api/auth/edit/${user.id}`} method="POST">
        <TextField label="Username" value={user.username} name="username" />
        <TextField label="Email" value={user.email} name="email" type="email" />
        <TextField label="First Name" value={user.firstName || ""} name="firstName" />
        <TextField label="Last Name" value={user.lastName || ""} name="lastName" />
        <TextField label="Phone" value={user.phoneNumber || ""} name="phoneNumber" />
        <TextField label="Password" name="password" type="password" />
        <Button type="submit">Save</Button>
      </Form>

      <br />

      <Form action="" method="POST">
        <TextField label="Address Line 1" />
        <TextField label="Address Line 2" />
        <TextField label="Unit #" />
        <TextField label="City" />
        <TextField label="Region" />
        <TextField label="Postal Code" />
        <TextField label="Country" />
      </Form>
    </div>
  );
}

export const getServerSideProps = withSessionSsr(async function ({
  params,
  req,
  query,
}) {
  const { user } = req.session;

  const userRecord = await prisma.user
    .findUnique({
      select: {
        username: true,
        avatarURL: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        id: true,
        email: true,
        role: true,
        userAddress: true,
      },
      where: { id: user?.id },
    })
    .catch(console.log);

  if (!userRecord)
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };

  return {
    props: {
      user: userRecord || null,
    },
  };
});
