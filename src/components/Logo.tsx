import Image from "next/image";

export function Logo() {
  return (
    <>
      <Image
        src="/logo-light.png"
        alt="Lead Every Day"
        width={63}
        height={36}
        priority
        className="logo-light"
      />
      <Image
        src="/logo-dark.png"
        alt="Lead Every Day"
        width={64}
        height={36}
        priority
        className="logo-dark"
      />
    </>
  );
}
