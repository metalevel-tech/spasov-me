/**
 * @see https://nextjs.org/docs/app/api-reference
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 * @see Ref: https://youtu.be/wm5gMKuwSYk?t=7699
 *
 * @note The PATCH and DELETE functions are created bt the help of the
 * 			 VSC extension Bito GPT-4 AI. To check how this is implemented
 *       in the original guide you can @see https://youtu.be/wm5gMKuwSYk?t=10336
 *
 * Spas Z. Spasov REST API Implementation notes:
 * A route file (only for app/ router) allows you
 * to create custom request handlers for a given route.
 *
 * export async function GET(request: Request) {}     // GET:  Retrieve a resource(s)
 * export async function HEAD(request: Request) {}    // HEAD: Retrieve resource metadata
 * export async function POST(request: Request) {}    // POST: Create a new resource
 * export async function PUT(request: Request) {}     // PUT:  Update a resource
 * export async function PATCH(request: Request) {}   // PATCH: Partially update a resource
 * export async function DELETE(request: Request) {}  // DELETE: Delete a resource
 * export async function OPTIONS(request: Request) {} // OPTIONS: Retrieve resource options
 *
 * If `OPTIONS` is not defined, Next.js will automatically
 * implement `OPTIONS` and  set the appropriate Response
 * `Allow` header depending on the other methods defined
 * in the route handler.
 *
 * Example of a route and query params:
 *
 *		/api/data 				  -> params: {}
 *		/api/data/posts     -> params: { query: [ 'posts' ] }
 *		/api/data/posts/id  -> params: { query: [ 'posts', 'id' ] }
 *
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import AboutEntry from "@/models/about-entry";

import { authOptions } from "@/lib/auth-options";

import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import Page from "@/models/page";
import Tag from "@/models/tag";
import User from "@/models/user";

import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";

import { errorMessages } from "../../common";

interface Context {
	params: { query: string[] };
}

function _id(id: string) {
	return id ? { _id: id } : {};
}

export async function GET(request: NextRequest, { params }: Context) {
	try {
		const session = await getServerSession(authOptions);

		if (!params.query) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		const [type, id] = params.query;

		await connectToMongoDb();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let response: Omit<any, never>[] = [];

		switch (type) {
			case "pages": {
				if (session) {
					response = await Page.find(_id(id)).populate(["creator", "image"]);
				} else {
					response = await Page.find(_id(id)).populate(["image"]);
				}

				break;
			}

			case "about-entries": {
				if (session) {
					response = await AboutEntry.find(_id(id)).populate(["creator", "attachment"]);
				} else {
					response = await AboutEntry.find(_id(id)).populate(["attachment"]);
				}

				break;
			}

			case "tags": {
				if (session) {
					response = await Tag.find(_id(id)).populate(["creator"]);
				} else {
					response = await Tag.find(_id(id));
				}

				break;
			}

			case "users": {
				if (session) {
					response = await User.find(_id(id));
				} else {
					return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
				}

				break;
			}
		}

		return NextResponse.json(
			{
				message: { type, length: response.length, method: request.method },
				data: response,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}

export async function POST(request: NextRequest, { params }: Context) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
		}

		if (!params.query) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		const [type] = params.query;

		if (!type) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		const request_object = await request.json();

		deleteFalsyKeys(request_object);

		await connectToMongoDb();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let response: Omit<any, never>[] = [];
		let dbDocument;

		switch (type) {
			case "pages": {
				dbDocument = new Page(request_object);

				await dbDocument.save();

				if (session) {
					response = await dbDocument.populate(["creator", "image"]);
				} else {
					response = await dbDocument.populate(["image"]);
				}

				break;
			}

			case "about-entries": {
				dbDocument = new AboutEntry(request_object);

				await dbDocument.save();

				if (session) {
					response = await dbDocument.populate(["creator", "attachment"]);
				} else {
					response = await dbDocument.populate(["attachment"]);
				}

				break;
			}

			case "tags": {
				dbDocument = new Tag(request_object);

				await dbDocument.save();

				if (session) {
					response = await dbDocument.populate(["creator"]);
				} else {
					response = await dbDocument.populate();
				}

				break;
			}

			case "users": {
				dbDocument = new User(request_object);

				await dbDocument.save();

				if (session) {
					response = await dbDocument.populate(["creator"]);
				} else {
					return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
				}

				break;
			}

			default:
				return NextResponse.json({ error: errorMessages.e501 }, { status: 501 });
		}

		return NextResponse.json(
			{
				message: { type, created: true, method: request.method },
				data: response,
			},
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, { params }: Context) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
		}

		if (!params.query) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		const [type, id] = params.query;

		if (!type || !id) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		const request_object = await request.json();

		deleteFalsyKeys(request_object);

		await connectToMongoDb();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let response: Omit<any, never>[] = [];
		let dbDocument;

		switch (type) {
			case "pages": {
				dbDocument = Page;

				break;
			}

			case "about-entries": {
				dbDocument = AboutEntry;

				break;
			}

			case "tags": {
				dbDocument = Tag;

				break;
			}

			case "users": {
				dbDocument = User;

				break;
			}

			default:
				return NextResponse.json({ error: errorMessages.e501 }, { status: 501 });
		}

		const updatedDocument = await dbDocument.findOneAndUpdate(_id(id), request_object, {
			new: true,
			strict: true,
		});

		if (!updatedDocument) {
			return NextResponse.json({ error: errorMessages.e404 }, { status: 404 });
		}

		if (!request_object.image && updatedDocument.image) {
			updatedDocument.image = undefined;
		}

		if (!request_object.attachment && updatedDocument.attachment) {
			updatedDocument.attachment = undefined;
		}

		updatedDocument.save();

		switch (type) {
			case "pages": {
				if (session) {
					response = await updatedDocument.populate(["creator", "image"]);
				} else {
					response = await updatedDocument.populate(["image"]);
				}

				break;
			}

			case "about-entries": {
				if (session) {
					response = await updatedDocument.populate(["creator", "attachment"]);
				} else {
					response = await updatedDocument.populate(["attachment"]);
				}

				break;
			}

			case "tags": {
				if (session) {
					response = await updatedDocument.populate(["creator"]);
				} else {
					response = await updatedDocument.populate();
				}

				break;
			}

			case "users": {
				if (session) {
					response = await updatedDocument.populate(["creator"]);
				} else {
					return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
				}

				break;
			}

			default:
				return NextResponse.json({ error: errorMessages.e501 }, { status: 501 });
		}

		return NextResponse.json(
			{
				message: { type, updated: true, method: request.method },
				data: response,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}

// The same as PUT() at the moment...
export async function PATCH(request: NextRequest, { params }: Context) {
	return PUT(request, { params });
}

export async function DELETE(request: NextRequest, { params }: Context) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
		}

		if (!params.query || params.query.length !== 2) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		const [type, id] = params.query;

		if (!type || !id) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		await connectToMongoDb();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let dbDocModel: any;

		switch (type) {
			case "pages": {
				dbDocModel = Page;
				break;
			}

			case "tags": {
				dbDocModel = Tag;
				break;
			}

			case "users": {
				dbDocModel = User;
				break;
			}

			case "about-entries": {
				dbDocModel = AboutEntry;
				break;
			}

			default: {
				return NextResponse.json({ error: errorMessages.e501 }, { status: 501 });
			}
		}

		const deletedDocument = await dbDocModel.findOneAndDelete(_id(id));

		if (!deletedDocument) {
			return NextResponse.json({ error: errorMessages.e404 }, { status: 404 });
		}

		return NextResponse.json(
			{
				message: { type, delete: true, method: request.method },
				data: deletedDocument,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}
