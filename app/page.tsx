"use client";

import NextLink from "next/link";
import { Link } from "@nextui-org/react";
import { button as buttonStyles } from "@nextui-org/theme";
import { title } from "@/components/primitives";
import { GithubIcon, Logo, BookIcon } from "@/components/icons";
import "@/styles/bg.css"

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center">
				<h1 className={title()}>Um jeito&nbsp;</h1>
				<h1 className={title({ color: "violet" })}>fácil </h1>
				<h1 className={title()}>de monitorar seus </h1>
				<h1 className={title({ color: "violet" })}>sensores&nbsp;</h1>
			</div>

			<div className="galaxy"></div>

			<div className="flex gap-3">
				<Link
					isExternal
					as={NextLink}
					href={"https://github.com/freecorps/monitor/wiki"}
					className={buttonStyles({ color: "primary", radius: "full", variant: "shadow" })}
				>
					<BookIcon size={20}/>
					Documentação
				</Link>
				<Link as={NextLink}
					href={"/monitor"}
					className={buttonStyles({ color: "danger", radius: "full", variant: "shadow" })}
				>
					<Logo size={20}/>
					Monitorar
				</Link>
				<Link
					isExternal
					as={NextLink}
					className={buttonStyles({ variant: "bordered", radius: "full" })}
					href={"https://github.com/freecorps/monitor"}
				>
					<GithubIcon size={20} />
					GitHub
				</Link>
			</div>
		</section>
	);
}
