import Icon from './Icon.jsx'

function Field({
  id,
  label,
  step,
  icon,
  value,
  onChange,
  options,
  disabled,
  placeholder,
  count
}) {
  return (
    <div className="field">
      <div className="field-label-row">
        <label htmlFor={id}>
          {icon && <Icon name={icon} size={15} />}
          <span>{label}</span>
        </label>
        {step && <span className="step-indicator">{step}</span>}
      </div>
      <div className="input-wrap">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default function SelectionPanel({
  states,
  commodities,
  districts,
  sel,
  setSel,
  loading,
  onFind,
  canFind
}) {
  const hasSelection = Boolean(sel.state || sel.commodity || sel.district)

  const handleReset = () => {
    setSel({ state: '', commodity: '', district: '' })
  }

  return (
    <section className="card selection" aria-label="Market selection panel">
      <div className="selection-top">
        <div className="selection-top-badge">
          <Icon name="filter" size={15} />
          <span>Market Selection Engine</span>
        </div>
        {hasSelection && (
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={handleReset}
            title="Clear all selections"
          >
            <Icon name="refresh" size={13} />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      <div className="field-grid">
        <Field
          id="f-state"
          label="State"
          step="Step 1"
          icon="pin"
          value={sel.state}
          options={states}
          placeholder={loading.states ? 'Loading states…' : 'Select state'}
          disabled={loading.states}
          onChange={(v) => setSel({ state: v, commodity: '', district: '' })}
          count={states.length}
        />

        <Field
          id="f-commodity"
          label="Commodity"
          step="Step 2"
          icon="scale"
          value={sel.commodity}
          options={commodities}
          placeholder={
            !sel.state
              ? 'Choose state first'
              : loading.commodities
              ? 'Loading commodities…'
              : 'Select commodity'
          }
          disabled={!sel.state || loading.commodities}
          onChange={(v) => setSel({ ...sel, commodity: v, district: '' })}
          count={commodities.length}
        />

        <Field
          id="f-district"
          label="District"
          step="Optional"
          icon="pin"
          value={sel.district}
          options={districts}
          placeholder={
            !sel.commodity
              ? 'Choose commodity first'
              : loading.districts
              ? 'Loading districts…'
              : 'All districts (Statewide)'
          }
          disabled={!sel.commodity || loading.districts}
          onChange={(v) => setSel({ ...sel, district: v })}
          count={districts.length}
        />

        <button
          className="btn find-btn"
          onClick={onFind}
          disabled={!canFind || loading.results}
          type="button"
        >
          {loading.results ? (
            <>
              <span className="spinner" aria-hidden="true" />
              <span>Analyzing markets…</span>
            </>
          ) : (
            <>
              <Icon name="sparkles" size={17} />
              <span>Find markets</span>
            </>
          )}
        </button>
      </div>
    </section>
  )
}
