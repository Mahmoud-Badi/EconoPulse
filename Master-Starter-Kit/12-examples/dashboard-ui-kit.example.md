# Dashboard & Admin UI Kit -- Delta TMS Example

> **Project:** Delta TMS (Wheelchair Transportation Management)
> **Stack:** Next.js + Tailwind CSS + Shadcn/ui
> **This is a filled-in example of `07-ui-design-system/dashboard-admin-ui-kit.template.md`**

---

## Template Variables (Filled In)

- `PROJECT_NAME` = Delta TMS
- `COMPONENT_PREFIX` = tms
- `FRONTEND_FRAMEWORK` = next
- `CSS_FRAMEWORK` = tailwind
- `DESIGN_SYSTEM_LIBRARY` = shadcn/ui
- `ICON_LIBRARY` = lucide-react
- `PRIMARY_FONT` = Inter
- `MONO_FONT` = JetBrains Mono

---

## Entity Status Colors (Filled In)

```css
/* Ride Status Colors */
--status-pending: #f59e0b;        /* Amber -- awaiting confirmation */
--status-confirmed: #3b82f6;      /* Blue -- confirmed by dispatcher */
--status-assigned: #8b5cf6;       /* Purple -- driver assigned */
--status-driver-on-way: #06b6d4;  /* Cyan -- driver en route */
--status-driver-arrived: #10b981; /* Emerald -- driver at pickup */
--status-in-progress: #22c55e;    /* Green -- ride underway */
--status-completed: #16a34a;      /* Dark Green -- ride done */
--status-cancelled: #ef4444;      /* Red -- cancelled */
--status-no-show: #dc2626;        /* Dark Red -- patient no-show */

/* Driver Status Colors */
--driver-online: #22c55e;         /* Green */
--driver-offline: #6b7280;        /* Gray */
--driver-busy: #f59e0b;           /* Amber */
--driver-on-trip: #3b82f6;        /* Blue */
--driver-break: #8b5cf6;          /* Purple */
```

---

## Sidebar Navigation (Filled In)

```tsx
<Sidebar>
  <SidebarHeader><DeltaTMSLogo /></SidebarHeader>
  <SidebarNav>
    <SidebarNavItem href="/dispatcher" icon={<LayoutDashboard />}>Dashboard</SidebarNavItem>
    <SidebarNavItem href="/dispatcher/rides" icon={<Car />}>Rides</SidebarNavItem>
    <SidebarNavItem href="/dispatcher/drivers" icon={<Users />}>Drivers</SidebarNavItem>
    <SidebarNavItem href="/dispatcher/patients" icon={<User />}>Patients</SidebarNavItem>
    <SidebarNavItem href="/dispatcher/facilities" icon={<Building />}>Facilities</SidebarNavItem>
    <SidebarNavItem href="/dispatcher/vehicles" icon={<Truck />}>Vehicles</SidebarNavItem>
    <SidebarNavItem href="/dispatcher/invoices" icon={<Receipt />}>Invoicing</SidebarNavItem>
    <SidebarNavItem href="/dispatcher/reports" icon={<BarChart3 />}>Reports</SidebarNavItem>
    <SidebarNavItem href="/settings" icon={<Settings />}>Settings</SidebarNavItem>
  </SidebarNav>
  <SidebarFooter><UserMenu /></SidebarFooter>
</Sidebar>
```

---

## Dashboard KPI Row (Filled In)

```tsx
<KPIRow>
  <StatCard title="Today's Rides" value={42} icon={<Car />} change={+12} changeLabel="vs yesterday" />
  <StatCard title="Active Drivers" value={8} icon={<Users />} trend="neutral" />
  <StatCard title="Pending Rides" value={5} icon={<Clock />} trend="down" change={-3} />
  <StatCard title="Today's Revenue" value="$3,570" icon={<DollarSign />} trend="up" change={+8.5} />
</KPIRow>
```

---

## Domain Components (Tier 3 -- Filled In)

### RideCard

```tsx
<RideCard
  rideNumber="TR-20260115-001"
  patient={{ name: "John Smith", phone: "(555) 123-4567" }}
  pickup={{ address: "123 Main St", time: "10:00 AM" }}
  dropoff={{ address: "456 Hospital Dr" }}
  status="confirmed"
  driver={{ name: "Mike Johnson", avatar: "/mike.jpg" }}
  vehicleType="wheelchair"
  fare={85.50}
  onView={() => {}}
  onAssign={() => {}}
/>
```

### DriverCard

```tsx
<DriverCard
  driver={{
    name: "Mike Johnson",
    avatar: "/mike.jpg",
    rating: 4.8,
    totalTrips: 234,
    status: "online",
    vehicle: "2022 Toyota Sienna - White",
  }}
  currentRide={null}
  onAssign={() => {}}
  onViewSchedule={() => {}}
/>
```

### PatientCard

```tsx
<PatientCard
  patient={{
    name: "John Smith",
    phone: "(555) 123-4567",
    medicalNeeds: ["wheelchair", "oxygen"],
    lastRide: "Jan 10, 2026",
  }}
  onBook={() => {}}
  onView={() => {}}
/>
```

### PriceBreakdown

```tsx
<PriceBreakdown
  baseFare={25.00}
  distanceFare={31.25}
  distanceMiles={12.5}
  perMileRate={2.50}
  timeFare={17.50}
  surcharges={[{ label: "Wheelchair", amount: 15.00 }]}
  total={88.75}
/>
```

### Multi-Stop Builder

```tsx
<MultiStopBuilder
  stops={[
    { order: 0, type: "pickup", address: "123 Home St", passengers: ["John Smith"] },
    { order: 1, type: "pickup", address: "456 Oak Ave", passengers: ["Mary Jones"] },
    { order: 2, type: "dropoff", address: "Dialysis Center", passengers: ["John Smith", "Mary Jones"] },
  ]}
  onStopsChange={handleStopsChange}
  maxStops={5}
  showDistances={true}
/>
```

### RideStatusTimeline

```tsx
<RideStatusTimeline
  statuses={[
    { status: "pending", time: "9:00 AM", completed: true },
    { status: "confirmed", time: "9:05 AM", completed: true },
    { status: "assigned", time: "9:10 AM", completed: true },
    { status: "driver_on_way", time: "9:30 AM", completed: true },
    { status: "driver_arrived", time: "9:50 AM", current: true },
    { status: "in_progress", time: null, completed: false },
    { status: "completed", time: null, completed: false },
  ]}
/>
```

---

## Domain Component Count (Delta TMS)

| Category | Count |
|----------|-------|
| Ride Components | 12 (RideCard, RideStatusBadge, RideStatusTimeline, QuickBookForm, MultiStopBuilder, WillCallCard, StandingOrderCard, DuplicateBookingWarning, TripTypeSelector, RoundTripReturn, AppointmentTimeCalculator, CallLogEntry) |
| Driver Components | 8 (DriverCard, DriverAvailabilityRow, DriverScheduleTimeline, EarningsCard, ShiftNoteCard, PayoutSummaryCard, EarningsBreakdown, TimesheetRow) |
| Patient Components | 3 (PatientCard, PatientSearchAutocomplete, MedicalNeedsChecklist) |
| Vehicle/Fleet Components | 8 (VehicleCard, VehicleTypeSelector, InspectionChecklist, InspectionSummary, IssueReportCard, MaintenanceScheduleCard, MileageInput, DocumentExpiryCard) |
| Facility Components | 3 (FacilityCard, ContractSummaryCard, VolumeTierTable) |
| Financial Components | 5 (PriceBreakdown, InvoiceCard, InvoiceLineItem, PaymentMethodCard, PaymentReminderCard) |
| Map Components | 4 (RideMap, DriverLocationMarker, StopMarker, ServiceAreaMap) |
| Emergency Components | 3 (EmergencyAlertBanner, EmergencyButton, EmergencyTypeSelector) |
| Real-Time Components | 3 (ConnectionStatusIndicator, LiveUpdateBadge, ETACountdown) |
| **Domain Total** | **~49** |
| **Base Kit** | **~56** |
| **Grand Total** | **~105 components** |

---

*This example shows how a real transportation management system fills in the dashboard UI kit template. Your project will have different domain components but the same base kit structure.*
