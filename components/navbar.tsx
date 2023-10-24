"use client";

import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem,
} from "@nextui-org/react";
import { Link } from "@nextui-org/react";

import { link as linkStyles } from "@nextui-org/theme";

import NextLink from "next/link";
import clsx from "clsx";

import { ThemeSwitch } from "@/components/theme-switch";
import {
	GithubIcon,
} from "@/components/icons";

import { Logo } from "@/components/icons";

export const Navbar = () => {

	return (
		<NextUINavbar maxWidth="xl" position="sticky">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-1" href="/">
						<Logo />
						<p className="font-bold text-inherit">Monitor</p>
					</NextLink>
				</NavbarBrand>

				<ul className="hidden lg:flex gap-4 justify-start ml-2">
					<NavbarItem key={"monitor"}>
						<NextLink
							className={clsx(
								linkStyles({ color: "foreground" }),
								"data-[active=true]:text-primary data-[active=true]:font-medium"
							)}
							color="foreground"
							href={'/monitor'}
						>
							{'Monitorar'}
						</NextLink>
					</NavbarItem>
				</ul>

			</NavbarContent>

			<NavbarContent
				className="hidden sm:flex basis-1/5 sm:basis-full"
				justify="end"
			>
				<NavbarItem className="hidden sm:flex gap-2">
					<Link isExternal href={"https://github.com/freecorps/meteoro"} aria-label="Github">
						<GithubIcon className="text-default-500" />
					</Link>
					<ThemeSwitch />
				</NavbarItem>
			</NavbarContent>

			<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
				<Link isExternal href={"https://github.com/freecorps/monitor"} aria-label="Github">
					<GithubIcon className="text-default-500" />
				</Link>
				<ThemeSwitch />
				<NavbarMenuToggle />
			</NavbarContent>

			<NavbarMenu>
				<div className="mx-4 mt-2 flex flex-col gap-2">
					<NavbarMenuItem key={"github-navmenu"}>
						<Link
							color={"primary"}
							href="https://github.com/freecorps/monitor"
							size="lg"
						>
							{'Github'}
						</Link>
					</NavbarMenuItem>
					<NavbarMenuItem key={"previsao-navmenu"}>
						<Link
							color={"primary"}
							href="/monitor"
							size="lg"
						>
							{'monitor'}
						</Link>
					</NavbarMenuItem>
				</div>
			</NavbarMenu>
		</NextUINavbar>
	);
};
