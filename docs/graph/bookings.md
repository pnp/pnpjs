# @pnp/graph/bookings

Represents the Bookings services available to a user.

You can learn more  by reading the [Official Microsoft Graph Documentation](https://docs.microsoft.com/en-us/graph/api/resources/booking-api-overview?view=graph-rest-1.0).

## IBookingCurrencies, IBookingCurrency, IBookingBusinesses, IBookingBusiness, IBookingAppointments, IBookingAppointment, IBookingCustomers, IBookingCustomer, IBookingServices, IBookingService, IBookingStaffMembers, IBookingStaffMember,  IBookingCustomQuestions, IBookingCustomQuestion

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

## Get Booking Currencies

Get the supported currencies

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/bookings";

const graph = graphfi(...);

// Get all the currencies
const currencies = await graph.bookingCurrencies();
// get the details of the first currency
const currency = await graph.bookingCurrencies.getById(currencies[0].id)();
```

## Work with Booking Businesses

Get the bookings businesses

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/bookings";

const graph = graphfi(...);

// Get all the businesses
const businesses = await graph.bookingBusinesses();
// get the details of the first business
const business = graph.bookingBusinesses.getById(businesses[0].id)();
const businessDetails = await business();
// get the business calendar
const calView = await business.calendarView("2022-06-01", "2022-08-01")();
// publish the business
await business.publish();
// unpublish the business
await business.unpublish();
```

## Work with Booking Services

Get the bookings business services

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/bookings";
import { BookingService } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const business = graph.bookingBusinesses.getById({Booking Business Id})();
// get the business services
const services = await business.services();
// add a service
const newServiceDesc: BookingService = {booking service details -- see Microsoft Graph documentation};
const newService = services.add(newServiceDesc);
// get service by id
const service = await business.services.getById({service id})();
// update service
const updateServiceDesc: BookingService = {booking service details -- see Microsoft Graph documentation};
const update = await business.services.getById({service id}).update(updateServiceDesc);
// delete service
await business.services.getById({service id}).delete();
```

## Work with Booking Customers

Get the bookings business customers

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/bookings";
import { BookingCustomer } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const business = graph.bookingBusinesses.getById({Booking Business Id})();
// get the business customers
const customers = await business.customers();
// add a customer
const newCustomerDesc: BookingCustomer = {booking customer details -- see Microsoft Graph documentation};
const newCustomer = customers.add(newCustomerDesc);
// get customer by id
const customer = await business.customers.getById({customer id})();
// update customer
const updateCustomerDesc: BookingCustomer = {booking customer details -- see Microsoft Graph documentation};
const update = await business.customers.getById({customer id}).update(updateCustomerDesc);
// delete customer
await business.customers.getById({customer id}).delete();
```

## Work with Booking StaffMembers

Get the bookings business staffmembers

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/bookings";
import { BookingStaffMember } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const business = graph.bookingBusinesses.getById({Booking Business Id})();
// get the business staff members
const staffmembers = await business.staffMembers();
// add a staff member
const newStaffMemberDesc: BookingStaffMember = {booking staff member details -- see Microsoft Graph documentation};
const newStaffMember = staffmembers.add(newStaffMemberDesc);
// get staff member by id
const staffmember = await business.staffMembers.getById({staff member id})();
// update staff member
const updateStaffMemberDesc: BookingStaffMember = {booking staff member details -- see Microsoft Graph documentation};
const update = await business.staffMembers.getById({staff member id}).update(updateStaffMemberDesc);
// delete staffmember
await business.staffMembers.getById({staff member id}).delete();
```

## Work with Booking Appointments

Get the bookings business appointments

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/bookings";
import { BookingAppointment } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const business = graph.bookingBusinesses.getById({Booking Business Id})();
// get the business appointments
const appointments = await business.appointments();
// add a appointment
const newAppointmentDesc: BookingAppointment = {booking appointment details -- see Microsoft Graph documentation};
const newAppointment = appointments.add(newAppointmentDesc);
// get appointment by id
const appointment = await business.appointments.getById({appointment id})();
// cancel the appointment
await appointment.cancel();
// update appointment
const updateAppointmentDesc: BookingAppointment = {booking appointment details -- see Microsoft Graph documentation};
const update = await business.appointments.getById({appointment id}).update(updateAppointmentDesc);
// delete appointment
await business.appointments.getById({appointment id}).delete();
```

## Work with Booking Custom Questions

Get the bookings business custom questions

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/bookings";
import { BookingCustomQuestion } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const business = graph.bookingBusinesses.getById({Booking Business Id})();
// get the business custom questions
const customQuestions = await business.customQuestions();
// add a custom question
const newCustomQuestionDesc: BookingCustomQuestion = {booking custom question details -- see Microsoft Graph documentation};
const newCustomQuestion = customQuestions.add(newCustomQuestionDesc);
// get custom question by id
const customquestion = await business.customQuestions.getById({customquestion id})();
// update custom question
const updateCustomQuestionDesc: BookingCustomQuestion = {booking custom question details -- see Microsoft Graph documentation};
const update = await business.customQuestions.getById({custom question id}).update(updateCustomQuestionDesc);
// delete custom question
await business.customQuestions.getById({customquestion id}).delete();
```
