# Home Upkeep AI — Feature Specification

## Vision
Home Upkeep AI catches what annual walkthroughs miss. Upload inspection reports, photos, and maintenance logs. The system maps every major system in the building against expected lifespans and flags what needs attention before it becomes an emergency.

---

# PART A: 75 Large-Scale Production Features

## 1. Property & Portfolio Management (10 features)

1. **Multi-Property Portfolio Dashboard** — Central command center showing health scores, upcoming maintenance, financial summaries, and alerts across all properties in one view. Color-coded urgency indicators, drill-down navigation, and portfolio-level analytics.

2. **Property Onboarding Wizard** — Guided setup flow that walks owners through adding a property: address, year built, square footage, number of units, major systems (HVAC, plumbing, electrical, roof), last known service dates, and photo uploads. Pre-populates expected lifespans based on system types and install dates.

3. **Unit-Level Management** — Track individual rental units within multi-unit buildings. Each unit has its own appliance inventory, maintenance history, tenant assignment, and condition score. Supports single-family, duplex, triplex, apartment buildings, and commercial properties.

4. **Building Systems Inventory** — Comprehensive catalog of every major system: HVAC (furnace, AC, heat pump, ductwork), plumbing (water heater, pipes, sump pump, water softener), electrical (panel, wiring, outlets, GFCI), roof (shingles, flashing, gutters), foundation, windows, doors, insulation, fire suppression, elevators, and more. Each system tracks make, model, serial number, install date, warranty expiration, expected lifespan, and condition rating.

5. **Appliance Registry** — Track every appliance per unit: refrigerator, dishwasher, washer, dryer, oven, microwave, garbage disposal, water heater. Store brand, model, serial number, purchase date, warranty info, and manual PDFs. Auto-calculate remaining useful life.

6. **Property Comparison Analytics** — Compare maintenance costs, system health, tenant satisfaction, and ROI across properties. Identify which properties are money pits vs. performers. Benchmark against industry averages by property age, type, and region.

7. **Property Transfer & Onboarding from Purchase** — Import property data from real estate listings, inspection reports, and closing documents. Pre-populate systems inventory from home inspection PDFs using AI extraction.

8. **Portfolio Financial Overview** — Track total maintenance spend, projected future costs, capital expenditure planning, depreciation schedules, and tax-deductible maintenance expenses across all properties. Export-ready for accountants.

9. **Property Archival System** — When selling a property, archive all maintenance history, photos, and documents into a transferable package. Generate a comprehensive property health report for buyers. Optionally share read-only access with new owners.

10. **Multi-Owner & Partnership Support** — Support properties owned by LLCs, partnerships, or multiple individuals. Role-based access so partners can view shared properties, approve expenses, and review maintenance plans with appropriate permissions.

## 2. AI-Powered Inspection & Analysis (10 features)

11. **Photo-Based Condition Assessment** — Upload photos of any system or area. AI analyzes for visible issues: water stains, rust, cracks, mold, peeling paint, sagging, corrosion, worn seals. Returns severity rating, likely cause, and recommended action with confidence score.

12. **Inspection Report Parser** — Upload PDF/image inspection reports from professional home inspectors. AI extracts every finding, categorizes by system, assigns severity, maps to your building inventory, and creates actionable maintenance items automatically.

13. **Predictive Maintenance Engine** — Machine learning models trained on system lifespans, usage patterns, local climate data, and historical failure rates. Predicts when each system is likely to need repair or replacement. Updates predictions as new maintenance data comes in.

14. **AI Maintenance Advisor Chat** — Conversational AI that answers questions about your specific properties. "Should I replace the water heater or repair it?" "What's the typical cost for re-roofing a 1,500 sq ft ranch in Ohio?" "My tenant reported a slow drain — what should I check first?"

15. **Seasonal Maintenance Plan Generator** — AI generates customized seasonal checklists based on property type, location, climate zone, and current system conditions. Spring: check AC, clean gutters. Fall: furnace tune-up, winterize pipes. Adapts to local weather patterns.

16. **Cost Estimation Engine** — AI-powered estimates for any maintenance or repair task based on property location, system specifications, and current market rates. Pulls from contractor pricing databases and adjusts for local labor costs, materials, and complexity.

17. **Repair vs. Replace Decision Engine** — Analyzes system age, repair history, energy efficiency, warranty status, and remaining useful life to recommend repair or replacement. Includes ROI calculation showing break-even point for replacement investment.

18. **Natural Language Maintenance Logging** — Speak or type maintenance notes in natural language. "Changed the furnace filter at 123 Main on Tuesday" — AI parses the property, system, action, and date automatically and logs it to the correct property and system.

19. **Document Intelligence** — Upload any property document — leases, warranties, permits, invoices, contracts. AI extracts key dates, amounts, terms, and automatically links them to the relevant property, unit, or system.

20. **Risk Scoring & Prioritization** — AI calculates a risk score for every system based on age, condition, climate exposure, and failure impact (cost of failure + tenant displacement + liability). Prioritizes maintenance by risk-adjusted urgency, not just age.

## 3. Maintenance Scheduling & Workflow (10 features)

21. **Smart Maintenance Calendar** — Unified calendar view showing all scheduled maintenance, inspections, contractor visits, and lease events across all properties. Color-coded by urgency, filterable by property, system type, or assignee. Syncs with Google Calendar, Outlook, and Apple Calendar.

22. **Automated Recurring Maintenance** — Set up recurring maintenance schedules: HVAC filter changes every 90 days, gutter cleaning twice a year, smoke detector battery replacement annually. Auto-generates tasks, sends reminders, and tracks completion.

23. **Work Order Management** — Create, assign, track, and close work orders. Each work order links to a property, unit, and system. Tracks status (open, assigned, in progress, awaiting parts, complete), cost, photos before/after, and contractor notes.

24. **Contractor Management System** — Database of contractors with ratings, specialties, service areas, pricing, insurance verification, and license status. Track which contractors service which properties. Store contracts, W-9s, and insurance certificates.

25. **Contractor Bidding & Comparison** — For major work, send bid requests to multiple contractors. Compare estimates side-by-side on scope, materials, timeline, warranty, and price. AI highlights discrepancies and red flags in bids.

26. **Emergency Maintenance Protocol** — Automated emergency response workflows. Tenant reports burst pipe → system alerts owner, pages emergency plumber from preferred list, sends tenant instructions to shut off water, logs everything. Configurable escalation chains.

27. **Maintenance Task Dependencies** — Define task dependencies: "Before replacing the roof, get permit" → "After permit approved, schedule contractor" → "After roof complete, schedule inspection." Gantt-chart view for complex renovation projects.

28. **Tenant Maintenance Request Portal** — Tenant-facing portal where tenants submit maintenance requests with photos, descriptions, and urgency ratings. Requests route to the owner's dashboard, auto-categorize by system, and create work orders.

29. **Maintenance Approval Workflows** — For properties with managers or partners, route maintenance requests through approval chains. Set auto-approve thresholds ($500 and under auto-approved, $500+ requires owner approval).

30. **Inventory & Parts Tracking** — Track spare parts, filters, and supplies. Know what's on hand, what needs ordering, and which properties use which parts. Set reorder alerts. Link to supplier accounts for one-click ordering.

## 4. Financial Management & Analytics (10 features)

31. **Maintenance Cost Tracking** — Log every expense by property, unit, system, and category (repair, replacement, preventive, cosmetic). Track labor vs. materials. Compare actual spend against budget.

32. **Budget Planning & Forecasting** — AI-generated maintenance budgets based on property age, system conditions, and historical spend. 1-year, 3-year, and 5-year projections. Scenario modeling: "What if I defer the roof for 2 more years?"

33. **Capital Expenditure Planning** — Long-term CapEx planning for major replacements: roof ($15K in 2027), HVAC ($8K in 2029), windows ($12K in 2031). Visualize future cash needs and plan reserves accordingly.

34. **ROI Analytics Per Property** — Calculate true ROI including rental income minus all maintenance, mortgage, taxes, insurance, and vacancy costs. Show which properties are performing and which are dragging the portfolio.

35. **Tax-Ready Expense Reports** — Generate IRS Schedule E-ready expense reports. Categorize maintenance as repairs (immediately deductible) vs. improvements (depreciated). Export to CSV, PDF, or directly to accounting software.

36. **Vendor Payment Tracking** — Track payments to contractors and suppliers. Log invoices, payment dates, payment methods, and outstanding balances. Generate 1099-NEC reports for contractors paid over $600.

37. **Insurance Claim Documentation** — When damage occurs, generate comprehensive claim packages: timestamped photos, maintenance history proving due diligence, contractor estimates, and affected system details. Export as formatted PDF for insurance adjusters.

38. **Warranty Tracking & Alerts** — Track warranties for every system, appliance, and past repair. Alert before expiration. When a system fails, automatically check if it's under warranty and surface contractor/manufacturer contact info.

39. **Depreciation Calculator** — Calculate depreciation schedules for building improvements using IRS rules (27.5 years residential, component depreciation for major systems). Track cost basis adjustments for tax planning.

40. **Financial Dashboard & KPIs** — Key metrics at a glance: maintenance cost per unit, cost per square foot, maintenance-to-rent ratio, year-over-year spend trends, deferred maintenance liability, and emergency vs. planned maintenance ratio.

## 5. Tenant Management Integration (8 features)

41. **Tenant Communication Hub** — Centralized messaging with tenants about maintenance. Threaded conversations linked to work orders. Automated status updates: "Your maintenance request has been assigned to ABC Plumbing. Expected arrival: Thursday 2-4 PM."

42. **Tenant Satisfaction Tracking** — After maintenance completion, send satisfaction surveys. Track NPS by property, contractor, and maintenance type. Identify patterns in dissatisfaction.

43. **Lease-Linked Maintenance Responsibilities** — Define which maintenance tasks are tenant responsibility vs. owner responsibility per lease terms. Auto-route requests appropriately. "Tenant responsible for lawn care and furnace filter changes."

44. **Move-In / Move-Out Inspection System** — Digital inspection checklists for unit turnovers. Room-by-room photo documentation with condition ratings. Compare move-in vs. move-out photos side-by-side to assess damage beyond normal wear.

45. **Tenant Maintenance Training** — Automated onboarding content for new tenants: how to change furnace filters, reset GFCI outlets, use the garbage disposal properly, locate shutoff valves. Reduces unnecessary maintenance calls.

46. **Occupancy-Aware Scheduling** — Schedule maintenance based on tenant availability and occupancy status. Coordinate access for vacant units. Respect tenant quiet hours and preferences. Track key/lockbox access for contractors.

47. **Tenant Damage vs. Normal Wear AI** — Upload move-out photos and AI assesses whether damage is normal wear-and-tear or tenant-caused. References local landlord-tenant law for deposit dispute support. Generates documented assessments.

48. **Multi-Language Tenant Support** — Tenant portal, maintenance instructions, and communications available in multiple languages. AI-powered translation for maintenance conversations and documents.

## 6. Compliance & Legal (7 features)

49. **Local Code Compliance Tracker** — Track building codes, required inspections, and permits by municipality. Alert when inspections are due: fire inspection, boiler inspection, rental license renewal, lead paint disclosure, smoke/CO detector compliance.

50. **Permit Management** — Track open permits, required permits for planned work, and permit expiration. Store permit documents. Alert when work requires a permit and flag unpermitted work discovered during inspections.

51. **Safety System Compliance** — Track smoke detectors, carbon monoxide detectors, fire extinguishers, egress windows, handrails, and GFCI outlets. Schedule testing and replacement. Generate compliance reports for insurance and municipal inspections.

52. **Lead Paint & Asbestos Tracking** — For pre-1978 properties, track lead paint disclosure compliance, abatement history, and testing results. Track asbestos surveys and encapsulation/removal for older buildings. EPA/HUD compliance documentation.

53. **Fair Housing Maintenance Compliance** — Ensure maintenance response times and quality are consistent across all tenants. Flag disparities in maintenance response times. Document accommodation requests and responses for ADA compliance.

54. **Audit Trail & Legal Documentation** — Immutable audit log of all maintenance requests, responses, actions, and communications. Timestamped, linked to properties and tenants. Invaluable for legal disputes, insurance claims, and regulatory audits.

55. **Regulatory Update Alerts** — Monitor for changes in local building codes, landlord-tenant laws, and safety regulations that affect your properties. AI summarizes changes and identifies which properties are impacted.

## 7. IoT & Smart Property Integration (5 features)

56. **Smart Sensor Integration** — Connect water leak sensors, humidity monitors, temperature sensors, and smoke/CO detectors. Real-time alerts when sensors detect anomalies. Automatic work order creation for detected issues.

57. **Smart Thermostat Integration** — Connect Nest, Ecobee, Honeywell thermostats. Monitor HVAC runtime, detect unusual patterns indicating system issues, optimize energy usage. Alert when a furnace runs continuously (possible failure).

58. **Water Usage Monitoring** — Connect to smart water meters or leak detection systems. Detect unusual water usage indicating leaks. Track usage trends. Alert on spikes that may indicate running toilets, dripping faucets, or broken pipes.

59. **Security Camera & Access Integration** — Integrate with property security cameras and smart locks for contractor access management. Generate temporary access codes for scheduled maintenance. Log entry/exit for vacant units.

60. **Energy Monitoring & Optimization** — Track energy consumption per property/unit. Identify inefficiencies (poor insulation, aging HVAC, air leaks). Calculate ROI for energy upgrades. Generate Energy Star benchmarking reports.

## 8. Reporting & Intelligence (8 features)

61. **Customizable Dashboard Builder** — Drag-and-drop dashboard creation with widgets: charts, tables, maps, KPIs, alerts. Save multiple dashboard layouts for different views (financial, maintenance, tenant, portfolio overview).

62. **Automated Monthly Reports** — AI-generated monthly property reports: maintenance completed, costs incurred, upcoming maintenance, system health changes, tenant requests, and financial summary. Emailed as formatted PDF.

63. **Property Health Score** — Single composite score (0-100) for each property based on system ages, maintenance history, inspection findings, and outstanding issues. Trend over time. Benchmark against portfolio average and industry standards.

64. **Geographic Analytics & Map View** — Plot all properties on a map. Visualize maintenance patterns geographically. Identify regional trends (ice dam issues in northern properties, foundation issues in clay soil areas). Route-optimize contractor visits.

65. **Deferred Maintenance Liability Report** — Calculate the total cost of all deferred maintenance across the portfolio. Show risk exposure: what happens if deferred items fail. Prioritize by risk-adjusted urgency. Track deferred maintenance trends.

66. **Contractor Performance Analytics** — Rate contractors on timeliness, cost accuracy, quality, callback rate, and tenant satisfaction. Compare contractors for the same type of work. Identify top performers and those to avoid.

67. **Year-Over-Year Trend Analysis** — Track maintenance costs, system replacements, emergency vs. planned ratio, and property values over years. Identify improving and deteriorating properties. Correlate maintenance investment with property value retention.

68. **Export & API Access** — Export any data to CSV, Excel, PDF, or JSON. REST API for integration with accounting software (QuickBooks, Xero), property management platforms (AppFolio, Buildium), and custom workflows.

## 9. Collaboration & Access Control (4 features)

69. **Role-Based Access Control** — Define roles: Owner (full access), Property Manager (manage assigned properties), Maintenance Tech (view/complete assigned work orders), Accountant (financial data only), Tenant (own unit requests). Custom roles supported.

70. **Property Manager Dashboard** — Dedicated view for property managers handling multiple owners' properties. See all assigned properties, pending tasks, and owner communications in one place. Performance metrics visible to property owners.

71. **Team Communication & Notes** — Internal notes and comments on properties, work orders, and systems. @mention team members. Attach photos and documents. Threaded discussions on maintenance decisions.

72. **Client Portal for Property Management Companies** — White-labeled portal where property management companies give property owners read-only access to their properties' maintenance status, upcoming work, and financial summaries.

## 10. Mobile & Field Operations (3 features)

73. **Mobile Inspection App** — Offline-capable mobile app for conducting property inspections. Room-by-room checklists, photo capture with annotation, voice-to-text notes, barcode/QR scanning for appliance serial numbers. Syncs when back online.

74. **Contractor Mobile App** — Simplified mobile interface for contractors: view assigned work orders, navigate to property, check in/out, upload before/after photos, log materials used, submit completion report. Time tracking included.

75. **QR Code Property Labels** — Generate QR codes for each system/appliance. Stick on water heaters, HVAC units, electrical panels. Anyone scans it → sees maintenance history, manuals, warranty info, and can submit an issue report.

---

# PART B: 150+ Quality-of-Life Features

## UX & Navigation (15)
76. Dark mode / light mode toggle
77. Keyboard shortcuts for power users (N=new work order, S=search, P=properties)
78. Global search across properties, systems, work orders, contractors, documents
79. Breadcrumb navigation for deep hierarchies (Portfolio → Property → Unit → System)
80. Recently viewed items sidebar
81. Quick-add floating action button (new property, work order, expense, note)
82. Customizable sidebar with pinned properties
83. Drag-and-drop reordering of dashboard widgets
84. Collapsible sidebar sections
85. Full-screen focus mode for work order details
86. Persistent filter preferences per view
87. Command palette (Cmd+K) for quick navigation
88. Onboarding tour with interactive tooltips for new users
89. Contextual help tooltips on complex fields
90. Accessibility: WCAG 2.1 AA compliance, screen reader support, high contrast mode

## Notifications & Alerts (15)
91. Push notifications (mobile + desktop)
92. Email digest options: immediate, daily summary, weekly summary
93. SMS alerts for critical emergencies (burst pipe, no heat in winter)
94. Notification preferences per property and severity level
95. Snooze notifications with custom duration
96. Quiet hours configuration (no non-emergency alerts 10 PM - 7 AM)
97. Alert escalation: if not acknowledged in 4 hours, escalate to backup contact
98. Maintenance reminder notifications: "Furnace filter due in 3 days"
99. Warranty expiration warnings (30/60/90 days before)
100. Lease expiration alerts with maintenance review prompt
101. Weather-triggered alerts: "Freeze warning tonight — verify pipe insulation"
102. Batch notification management (mark all read, bulk snooze)
103. Notification history/log searchable by date and type
104. Custom webhook notifications for integration with Slack, Teams, Discord
105. In-app notification center with filtering and categories

## Data Entry & Input (15)
106. Bulk import properties from CSV/Excel spreadsheet
107. Auto-fill property details from address lookup (Zillow, county records)
108. Duplicate property (template a similar property with same systems)
109. Voice input for maintenance notes (speech-to-text)
110. Photo batch upload with auto-organization by room/system
111. Barcode scanner for appliance model/serial number lookup
112. Copy work order to another property
113. Template work orders for common tasks (HVAC tune-up, gutter clean)
114. Auto-save drafts for all forms
115. Inline editing on table views (click cell to edit)
116. Smart defaults based on property type and region
117. Paste invoice data and auto-extract vendor, amount, date, items
118. Drag-and-drop document upload anywhere in the app
119. Multi-select and bulk actions on work orders (assign, close, re-prioritize)
120. Undo/redo for recent actions (deleted a work order? Undo within 30 seconds)

## Search & Filtering (10)
121. Advanced filters: by property, date range, cost range, system type, severity, status
122. Saved filter presets ("Show me all open HVAC issues across portfolio")
123. Natural language search: "water heater issues last year"
124. Search within uploaded documents (OCR-indexed PDFs)
125. Filter work orders by contractor, cost range, or completion time
126. Tag system for custom categorization (e.g., "insurance claim", "tenant-caused")
127. Search history with quick re-search
128. Sort by any column in table views
129. Map-based search: click a property on the map to see all its data
130. Cross-property search: "Show all furnaces over 15 years old"

## Calendar & Scheduling (10)
131. Drag-and-drop rescheduling on calendar view
132. Time-of-day preferences for maintenance (mornings only, weekdays only)
133. Conflict detection: alert when two tasks scheduled for same unit overlap
134. Seasonal color coding on calendar
135. Multi-week and multi-month calendar views
136. iCal feed subscription for read-only calendar sync
137. Recurring task exceptions (skip December for lawn care)
138. Buffer time between scheduled tasks at same property
139. Weather-aware scheduling: don't schedule exterior work during rain forecast
140. Calendar printing with daily/weekly task lists

## Photos & Media (10)
141. Photo annotation: draw arrows, circles, text on images to highlight issues
142. Before/after photo comparison slider
143. Photo tagging by room, system, and issue type
144. Automatic photo timestamp and GPS verification
145. Photo galleries per property organized by room and date
146. Video upload support for complex issues
147. 360° photo support for room documentation
148. Automatic image compression to save storage
149. Photo comparison over time (same angle, different dates)
150. Bulk photo download for insurance claims or property sales

## Documents & Files (10)
151. Document categorization: warranties, manuals, invoices, permits, leases, reports
152. Document expiration tracking with renewal reminders
153. Optical Character Recognition (OCR) for scanned documents
154. Version history for updated documents
155. Shared document library (common manuals, standard forms)
156. Document templates (maintenance checklist, move-in form, bid request)
157. E-signature integration for contractor agreements
158. Auto-link invoices to work orders by matching dates and amounts
159. Cloud storage integration (Google Drive, Dropbox, OneDrive sync)
160. Zip download of all documents for a property

## Contractor & Vendor (10)
161. Contractor availability calendar
162. Preferred contractor auto-assignment by specialty and property location
163. Contractor insurance expiration alerts
164. Contractor review/rating after each job
165. Contractor communication log (calls, emails, texts)
166. Contractor payment terms tracking (Net 30, Net 60)
167. Contractor license verification by state
168. Contractor comparison for past similar jobs
169. One-click "request quote" to saved contractors
170. Contractor blacklist with reason documentation

## Tenant Experience (10)
171. Tenant self-service password reset
172. Tenant maintenance request status tracker with timeline
173. Tenant preferred contact method (text, email, phone, in-app)
174. Tenant maintenance history visible to tenant (their unit only)
175. Tenant photo upload for maintenance requests
176. Estimated repair timeline shown to tenant
177. Tenant rating of maintenance experience
178. Tenant emergency contact management
179. Tenant notification when contractor is en route
180. Anonymous tenant feedback option

## Financial & Accounting (10)
181. Receipt photo upload with auto-data extraction
182. Recurring expense tracking (monthly pest control, quarterly lawn service)
183. Split expenses across units or properties
184. Currency support for international properties
185. Mileage tracking for property visits
186. Petty cash tracking for small maintenance items
187. Payment method tracking per expense
188. Quick-entry expense log (amount, category, property — three fields, done)
189. Year-end financial summary with charts
190. Budget vs. actual variance highlighting

## Reporting & Export (10)
191. One-click report generation for common reports
192. Scheduled report delivery (weekly email, monthly PDF)
193. Custom report builder with drag-and-drop fields
194. Chart type options: bar, line, pie, scatter, stacked
195. Report sharing via link with optional password protection
196. Print-optimized report layouts
197. Comparison reports: this year vs. last year, property A vs. property B
198. Maintenance heatmap: which months have highest spend
199. System failure frequency analysis
200. Report annotations and comments

## Automation & Workflows (10)
201. If/then automation rules: "If water leak sensor triggers → create emergency work order + SMS owner"
202. Scheduled actions: "Every March 1, create 'spring inspection' task for all properties"
203. Auto-close work orders after 7 days with no activity (with notification)
204. Auto-assign work orders to preferred contractor by category
205. Trigger inspections when lease renewal approaches
206. Auto-generate tasks when a new property is added (based on property type template)
207. Auto-categorize expenses using AI from description and amount
208. Workflow templates for common processes (tenant turnover, annual inspection, emergency response)
209. Zapier/Make integration for connecting to external tools
210. Auto-archive completed work orders after 30 days

## Data & Privacy (10)
211. Data export in standard formats (JSON, CSV, PDF)
212. Account deletion with full data purge option
213. Two-factor authentication (TOTP, SMS)
214. Session management (view active sessions, force logout)
215. IP-based access restrictions
216. Encryption at rest for all documents and photos
217. Audit log viewable by account owner
218. GDPR compliance tools (data subject requests, consent management)
219. SOC 2 Type II compliance
220. Automatic session timeout with configurable duration

## Performance & Reliability (10)
221. Offline mode for mobile: view properties and create work orders without connection
222. Progressive web app (installable on any device)
223. Lazy loading for large photo galleries
224. Infinite scroll for work order lists
225. Optimistic UI updates (instant feedback, sync in background)
226. Auto-retry failed uploads
227. Data caching for frequently accessed properties
228. Skeleton loading screens instead of spinners
229. Background sync indicator
230. Graceful degradation when API is slow

## Miscellaneous QoL (15)
231. Customizable property labels and color coding
232. Favorite/star important work orders for quick access
233. Notes/comments with @mentions and notifications
234. Activity feed showing recent changes across portfolio
235. Quick switch between properties with keyboard shortcut
236. Maintenance cost benchmarking against similar properties in your area
237. "What would you do?" AI suggestions on dashboard
238. Empty state illustrations with helpful getting-started prompts
239. Tooltips showing last maintenance date when hovering over systems
240. Batch print QR labels for all systems in a property
241. Import/export property data between accounts
242. Seasonal dashboard themes (subtle, optional)
243. Unit conversion (sq ft / sq m, °F / °C)
244. Time zone support for properties in different regions
245. Changelog / what's new notification for app updates
