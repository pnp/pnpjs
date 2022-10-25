import {
    BookingBusiness as IBookingBusinessEntity,
    BookingAppointment as IBookingAppointmentEntity,
    BookingCustomer as IBookingCustomerEntity,
    BookingService as IBookingServiceEntity,
    BookingStaffMember as IBookingStaffMemberEntity,
    BookingCurrency as IBookingCurrencyEntity,
    BookingCustomQuestion as IBookingCustomQuestionEntity,
} from "@microsoft/microsoft-graph-types";
import { _GraphQueryableCollection, graphInvokableFactory, _GraphQueryableInstance } from "../graphqueryable.js";
import { defaultPath, deleteable, IDeleteable, updateable, IUpdateable, getById, IGetById } from "../decorators.js";
import { graphPost } from "../operations.js";
import { body } from "@pnp/queryable";
import { calendarView } from "./funcs.js";

/**
 * Describes a Booking Currency entity
 *
 */
export class _BookingCurrency extends _GraphQueryableInstance<IBookingCurrencyEntity> { }
export interface IBookingCurrency extends _BookingCurrency { }
export const BookingCurrency = graphInvokableFactory<IBookingCurrency>(_BookingCurrency);

/**
 * Describes a collection of Booking Currency objects
 *
 */
@defaultPath("solutions/bookingCurrencies")
@getById(BookingCurrency)
export class _BookingCurrencies extends _GraphQueryableCollection<IBookingCurrencyEntity[]>{ }
export interface IBookingCurrencies extends _BookingCurrencies, IGetById<IBookingCurrency> { }
export const BookingCurrencies = graphInvokableFactory<IBookingCurrencies>(_BookingCurrencies);

/**
 * Represents a booking business entity
 */
@deleteable()
@updateable()
export class _BookingBusiness extends _GraphQueryableInstance<IBookingBusinessEntity> {
    /**
     * Get the calendar view for the booking business.
     */
    public calendarView = calendarView;

    /**
     * Make the scheduling page of a business available to external customers.
     */
    public publish(): Promise<void> {
        return graphPost(BookingBusiness(this, "publish"));
    }
    /**
     * Make the scheduling page of this business not available to external customers.
     */
    public unpublish(): Promise<void> {
        return graphPost(BookingBusiness(this, "unpublish"));
    }

    /**
     * Get the appointments for the booking business.
     */
    public get appointments(): IBookingAppointments {
        return BookingAppointments(this);
    }

    /**
     * Get the customers for the booking business.
     */
    public get customers(): IBookingCustomers {
        return BookingCustomers(this);
    }

    /**
     * Get the services for the booking business.
     */
    public get services(): IBookingServices {
        return BookingServices(this);
    }

    /**
     * Get the staff members for the booking business.
     */
    public get staffMembers(): IBookingStaffMembers {
        return BookingStaffMembers(this);
    }

    /**
     * Get the staff members for the booking business.
     */
    public get customQuestions(): IBookingCustomQuestions {
        return BookingCustomQuestions(this);
    }
}
export interface IBookingBusiness extends _BookingBusiness, IDeleteable, IUpdateable { }
export const BookingBusiness = graphInvokableFactory<IBookingBusiness>(_BookingBusiness);

/**
 * Describes a collection of Booking Business objects
 *
 */
@defaultPath("solutions/bookingBusinesses")
@getById(BookingBusiness)
export class _BookingBusinesses extends _GraphQueryableCollection<IBookingBusinessEntity[]>{
    /**
         * Create a new booking business as specified in the request body.
         *
         * @param name The name of the business, which interfaces with customers. This name appears at the top of the business scheduling page.
         * @param additionalProperties A plain object collection of additional properties you want to set on the new group of type IBookingBusiness
         */
    public async add(name: string, additionalProperties: Record<string, any> = {}): Promise<IBookingBusinessAddResult> {

        const postBody = {
            displayName: name,
            ...additionalProperties,
        };

        const data = await graphPost(this, body(postBody));

        return {
            data,
            bookingBusiness: (<any>this).getById(data.id),
        };
    }
}

export interface IBookingBusinesses extends _BookingBusinesses, IGetById<IBookingBusiness> { }
export const BookingBusinesses = graphInvokableFactory<IBookingBusinesses>(_BookingBusinesses);

/**
 * Represents a booking appointment entity
 */
@deleteable()
@updateable()
export class _BookingApointment extends _GraphQueryableInstance<IBookingAppointmentEntity> {
    /**
     * Cancel the specified bookingAppointment in the specified bookingBusiness and send a message to the involved customer and staff members.
     */
    public cancel(cancellationMessage: string): Promise<void> {
        const postBody = { cancellationMessage };
        return graphPost(BookingAppointment(this, "cancel"), body(postBody));
    }
}
export interface IBookingAppointment extends _BookingApointment, IDeleteable, IUpdateable { }
export const BookingAppointment = graphInvokableFactory<IBookingAppointment>(_BookingApointment);

/**
 * Describes a collection of booking appointment objects
 *
 */
@defaultPath("appointments")
@getById(BookingAppointment)
export class _BookingAppointments extends _GraphQueryableCollection<IBookingAppointmentEntity[]>{
    /**
     * Create a new booking appointment as specified in the request body.
     *
     * @param bookingAppointment  a JSON representation of a BookingAppointment object.
     */
    public async add(bookingAppointment: IBookingAppointmentEntity): Promise<IBookingAppointmentAddResult> {
        const data = await graphPost(this, body(bookingAppointment));

        return {
            data,
            bookingAppointment: (<any>this).getById(data.id),
        };
    }
}

export interface IBookingAppointments extends _BookingAppointments, IGetById<IBookingAppointment> { }
export const BookingAppointments = graphInvokableFactory<IBookingAppointments>(_BookingAppointments);

/**
 * Represents a booking customer entity
 */
@deleteable()
@updateable()
export class _BookingCustomer extends _GraphQueryableInstance<IBookingCustomerEntity> { }
export interface IBookingCustomer extends _BookingCustomer, IDeleteable, IUpdateable { }
export const BookingCustomer = graphInvokableFactory<IBookingCustomer>(_BookingCustomer);

/**
 * Describes a collection of booking customer objects
 *
 */
@defaultPath("customers")
@getById(BookingCustomer)
export class _BookingCustomers extends _GraphQueryableCollection<IBookingCustomerEntity[]>{
    /**
     * Create a new booking customer as specified in the request body.
     *
     * @param bookingCustomer  a JSON representation of a BookingCustomer object.
     */
    public async add(bookingCustomer: IBookingCustomerEntity): Promise<IBookingCustomerAddResult> {
        const data = await graphPost(this, body(bookingCustomer));

        return {
            data,
            bookingCustomer: (<any>this).getById(data.id),
        };
    }
}

export interface IBookingCustomers extends _BookingCustomers, IGetById<IBookingCustomer> { }
export const BookingCustomers = graphInvokableFactory<IBookingCustomers>(_BookingCustomers);

/**
 * Represents a booking service entity
 */
@deleteable()
@updateable()
export class _BookingService extends _GraphQueryableInstance<IBookingServiceEntity> { }
export interface IBookingService extends _BookingService, IDeleteable, IUpdateable { }
export const BookingService = graphInvokableFactory<IBookingService>(_BookingService);

/**
 * Describes a collection of booking service objects
 *
 */
@defaultPath("services")
@getById(BookingService)
export class _BookingServices extends _GraphQueryableCollection<IBookingServiceEntity[]>{
    /**
     * Create a new booking service as specified in the request body.
     *
     * @param bookingService  a JSON representation of a BookingService object.
     */
    public async add(bookingService: IBookingServiceEntity): Promise<IBookingServiceAddResult> {
        const data = await graphPost(this, body(bookingService));

        return {
            data,
            bookingService: (<any>this).getById(data.id),
        };
    }
}

export interface IBookingServices extends _BookingServices, IGetById<IBookingService> { }
export const BookingServices = graphInvokableFactory<IBookingServices>(_BookingServices);

/**
 * Represents a booking staffmember entity
 */
@deleteable()
@updateable()
export class _BookingStaffMember extends _GraphQueryableInstance<IBookingStaffMemberEntity> { }
export interface IBookingStaffMember extends _BookingStaffMember, IDeleteable, IUpdateable { }
export const BookingStaffMember = graphInvokableFactory<IBookingStaffMember>(_BookingStaffMember);

/**
 * Describes a collection of booking staffmember objects
 *
 */
@defaultPath("staffMembers")
@getById(BookingStaffMember)
export class _BookingStaffMembers extends _GraphQueryableCollection<IBookingStaffMemberEntity[]>{
    /**
     * Create a new booking staffmember as specified in the request body.
     *
     * @param bookingStaffMember  a JSON representation of a BookingStaffMember object.
     */
    public async add(bookingStaffMember: IBookingStaffMemberEntity): Promise<IBookingStaffMemberAddResult> {
        const data = await graphPost(this, body(bookingStaffMember));

        return {
            data,
            bookingStaffMember: (<any>this).getById(data.id),
        };
    }
}

export interface IBookingStaffMembers extends _BookingStaffMembers, IGetById<IBookingStaffMember> { }
export const BookingStaffMembers = graphInvokableFactory<IBookingStaffMembers>(_BookingStaffMembers);

/**
 * Represents a booking custom questions entity
 */
@deleteable()
@updateable()
export class _BookingCustomQuestion extends _GraphQueryableInstance<IBookingCustomQuestionEntity> { }
export interface IBookingCustomQuestion extends _BookingCustomQuestion, IDeleteable, IUpdateable { }
export const BookingCustomQuestion = graphInvokableFactory<IBookingCustomQuestion>(_BookingCustomQuestion);

/**
 * Describes a collection of booking custom questions objects
 *
 */
@defaultPath("customquestions")
@getById(BookingCustomQuestion)
export class _BookingCustomQuestions extends _GraphQueryableCollection<IBookingCustomQuestionEntity[]>{
    /**
     * Create a new booking customquestions as specified in the request body.
     *
     * @param bookingCustomQuestion  a JSON representation of a BookingCustomQuestion object.
     */
    public async add(bookingCustomQuestion: IBookingCustomQuestionEntity): Promise<IBookingCustomQuestionAddResult> {
        const data = await graphPost(this, body(bookingCustomQuestion));

        return {
            data,
            bookingCustomQuestion: (<any>this).getById(data.id),
        };
    }
}

export interface IBookingCustomQuestions extends _BookingCustomQuestions, IGetById<IBookingCustomQuestion> { }
export const BookingCustomQuestions = graphInvokableFactory<IBookingCustomQuestions>(_BookingCustomQuestions);

/**
 * IBookingBusinessAddResult
 */
export interface IBookingBusinessAddResult {
    bookingBusiness: IBookingBusinessEntity;
    data: any;
}

/**
 * IBookingAppointmentAddResult
 */
export interface IBookingAppointmentAddResult {
    bookingAppointment: IBookingAppointmentEntity;
    data: any;
}

/**
 * IBookingCustomerAddResult
 */
export interface IBookingCustomerAddResult {
    bookingCustomer: IBookingCustomerEntity;
    data: any;
}

/**
 * IBookingServiceAddResult
 */
export interface IBookingServiceAddResult {
    bookingService: IBookingServiceEntity;
    data: any;
}

/**
 * IBookingStaffMemberAddResult
 */
export interface IBookingStaffMemberAddResult {
    bookingStaffMember: IBookingStaffMemberEntity;
    data: any;
}

/**
 * IBookingCustomQuestionAddResult
 */
export interface IBookingCustomQuestionAddResult {
    bookingCustomQuestion: IBookingCustomQuestionEntity;
    data: any;
}
