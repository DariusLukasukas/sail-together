import Parse from "@/lib/parse/client";
import type { JobWithRelations } from "@/types/job";
import { Job } from "@/db/types/Job";
import { Location } from "@/db/types/Location";
import type { _User } from "@/db/types/_User";

function parseToJSON<T>(obj: Job): T {
    const json = obj.toJSON();
    return {
        ...json,
        id: obj.id,
        date: obj.get("date"),
        createdAt: obj.get("createdAt"),
        updatedAt: obj.get("updatedAt"),
        imageUrl: obj.get("imageUrl") || undefined,
        location: (() => {
            const loc = obj.get("locationId");
            if (!loc) return { id: '', name: '', address: '', longitude: 0, latitude: 0 };
            return {
                id: loc.id,
                name: loc.get("name"),
                address: loc.get("address"),
                longitude: loc.get("longitude"),
                latitude: loc.get("latitude"),
            };
        })(),
        createdBy: (() => {
            const creator = obj.get("createdById");
            if (!creator) return undefined;
            return {
                id: creator.id,
                name: creator.get("name") || creator.get("username") || "Unknown",
                avatarUrl: creator.get("avatarUrl"),
            };
        })(),
    } as T;
}

export async function getJobs(): Promise<JobWithRelations[]> {
    const query = new Parse.Query(Job);
    query.include("locationId");
    query.include("createdById");
    query.include("locationId");
    query.descending("createdAt");

    const results = await query.find();
    return results.map((job) => {
        const baseJob = parseToJSON<JobWithRelations>(job);
        return {
            ...baseJob,
            requirements: [],
            experience: [],
            qualifications: [],
        };
    });
}

export async function getJobById(id: string): Promise<JobWithRelations | null> {
    try {
        const jobQuery = new Parse.Query(Job);
        jobQuery.include("locationId");
        jobQuery.include("createdById");

        const jobPointer = Job.createWithoutData(id);

        const createRelationQuery = (className: string) => {
            const query = new Parse.Query(className);
            query.equalTo("jobId", jobPointer);
            query.ascending("order");
            return query;
        };

        const [obj, requirementsData, experienceData, qualificationsData] = await Promise.all([
            jobQuery.get(id),
            createRelationQuery("JobRequirement").find(),
            createRelationQuery("JobExperience").find(),
            createRelationQuery("JobQualification").find(),
        ]);

        const baseJob = parseToJSON<JobWithRelations>(obj);

        const requirements = requirementsData.map((r) => ({
            id: r.id!,
            jobId: id,
            requirement: r.get("requirement") || "",
            order: Number(r.get("order")) || 0,
        }));

        const experience = experienceData.map((e) => ({
            id: e.id!,
            jobId: id,
            experience: e.get("experience") || "",
            order: Number(e.get("order")) || 0,
        }));

        const qualifications = qualificationsData.map((q) => ({
            id: q.id!,
            jobId: id,
            qualification: q.get("qualification") || "",
            order: Number(q.get("order")) || 0,
        }));

        return {
            ...baseJob,
            requirements,
            experience,
            qualifications,
        };
    } catch (err: any) {
        if (err.code === Parse.Error.OBJECT_NOT_FOUND) {
            return null;
        }
        throw err;
    }
}

export async function createJob({
    title,
    type,
    date,
    vessel,
    description,
    location,
    isFavorite = false,
    imageFile,
    requirements = [],
    experience = [],
    qualifications = [],
}: {
    title: string;
    type: "Permanent" | "Contract" | "Seasonal" | "Temporary";
    date: Date;
    vessel: string;
    description?: string;
    location: {
        name: string;
        address: string;
        longitude: number;
        latitude: number;
    };
    isFavorite?: boolean;
    imageFile?: File;
    requirements?: string[];
    experience?: string[];
    qualifications?: string[];
}): Promise<Job> {
    const currentUser = Parse.User.current() as _User | null;
    if (!currentUser) {
        throw new Error("User must be logged in to create a job");
    }

    let imageUrl: string | undefined;
    if (imageFile) {
        const parseFile = new Parse.File(imageFile.name, imageFile);
        await parseFile.save();
        imageUrl = parseFile.url();
    }

    const locationObj = new Location();
    locationObj.name = location.name;
    locationObj.address = location.address;
    locationObj.longitude = location.longitude;
    locationObj.latitude = location.latitude;

    const job = new Job();
    job.title = title;
    job.type = type;
    job.date = date;
    job.vessel = vessel;
    job.locationId = locationObj;
    job.isFavorite = isFavorite;
    job.createdById = currentUser;

    if (description) job.description = description;
    if (imageUrl) job.imageUrl = imageUrl;

    const savedJob = await job.save();

    const createRelations = (
        className: string,
        items: string[],
        fieldName: string
    ) => {
        return items
            .filter(item => item.trim())
            .map((item, index) => {
                const obj = new Parse.Object(className);
                obj.set("jobId", savedJob);
                obj.set(fieldName, item.trim());
                obj.set("order", index);
                return obj;
            });
    };

    const relationsToSave = [
        ...createRelations("JobRequirement", requirements, "requirement"),
        ...createRelations("JobExperience", experience, "experience"),
        ...createRelations("JobQualification", qualifications, "qualification"),
    ];

    if (relationsToSave.length > 0) {
        await Parse.Object.saveAll(relationsToSave);
    }

    return savedJob as Job;
}

export async function toggleJobFavorite(id: string): Promise<boolean> {
    const query = new Parse.Query(Job);
    const job = await query.get(id);

    const newStatus = !job.get("isFavorite");
    job.set("isFavorite", newStatus);
    await job.save();

    return newStatus;
}