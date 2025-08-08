function medsApp() {
  const LSKEY = 'meds-game-state-v1';
  const initial = JSON.parse(localStorage.getItem(LSKEY) || 'null') || {
    notes: '',
    caseData: null,
    finalDx: '',
    rating: 3,
    reviewData: null,
    status: ''
  };

  const persist = (s) => localStorage.setItem(LSKEY, JSON.stringify(s));

  return {
    ...initial,
    loading: false,

    async generateCase() {
      this.loading = true; this.status = 'Menghubungi server…';
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: this.notes || 'Tidak ada catatan' })
        });
        if (!res.ok) throw new Error('Gagal membuat kasus');
        const data = await res.json();
        this.caseData = data.case;
        this.status = 'Kasus siap.';
      } catch (e) {
        console.error(e);
        this.status = 'Server lagi sibuk. Coba lagi ya.';
      } finally {
        this.loading = false; persist(this);
      }
    },

    review() {
      this.reviewData = {
        finalDiagnosis: this.finalDx || '(kosong)',
        rating: this.rating,
        notesUsed: this.notes || '(tak ada)'
      };
      this.status = 'Review dibuat.';
      persist(this);
    },

    resetAll() {
      this.notes = ''; this.caseData = null; this.finalDx = '';
      this.rating = 3; this.reviewData = null; this.status = '';
      persist(this);
    }
  };
}
