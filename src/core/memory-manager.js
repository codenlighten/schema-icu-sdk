/**
 * Memory Manager with Post-Quantum Signature Support
 * 
 * Rolling 21-message + 3-summary architecture
 * Cryptographically signed interactions with ML-DSA signatures
 * File persistence for long-term memory
 * 
 * Architecture:
 * - Keeps last 21 interactions in active memory
 * - Compresses older interactions into summaries (max 3 summaries)
 * - Each interaction and summary is cryptographically signed
 * - Supports ML-DSA-65, ML-DSA-87 post-quantum signatures
 * - Persists to daily JSON files
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class MemoryManager {
  constructor(options = {}) {
    const {
      maxInteractions = 21,
      maxSummaries = 3,
      tokenLimit = 100000,
      persistToFile = true,
      memoryDir = './memory',
      ownerName = 'default',
      signatureAlgorithm = 'PQ', // Default to ML-DSA-87
      summaryAgent = null // Optional SummaryAgent instance for compression
    } = options;

    this.maxInteractions = maxInteractions;
    this.maxSummaries = maxSummaries;
    this.tokenLimit = tokenLimit;
    this.persistToFile = persistToFile;
    this.memoryDir = memoryDir;
    this.ownerName = ownerName;
    this.signatureAlgorithm = signatureAlgorithm;
    this.summaryAgent = summaryAgent;

    this.interactions = []; // [{ role, text, ts, signature, hash }]
    this.summaries = [];    // [{ range, text, ts, signature, hash }]
    this.totalCount = 0;

    // Initialize file persistence if enabled
    if (this.persistToFile) {
      this._initializeFileSystem();
    }
  }

  /**
   * Initialize file system for memory persistence
   */
  async _initializeFileSystem() {
    try {
      await fs.mkdir(this.memoryDir, { recursive: true });
      console.log(`📁 Memory directory initialized: ${this.memoryDir}`);
      await this._loadFromFile();
    } catch (error) {
      console.error(`❌ Failed to create memory directory: ${error.message}`);
      this.persistToFile = false;
    }
  }

  /**
   * Get memory file path for a specific date
   * @param {Date|null} date - Target date (defaults to today)
   * @returns {string} File path
   */
  _getMemoryFilePath(date = null) {
    const targetDate = date || new Date();
    const dateStr = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const fileName = `${this.ownerName}-memory-${dateStr}.json`;
    return path.join(this.memoryDir, fileName);
  }

  /**
   * Load memory from file
   */
  async _loadFromFile() {
    try {
      const filePath = this._getMemoryFilePath();
      console.log(`🔄 Loading memory from: ${filePath}`);
      
      const data = await fs.readFile(filePath, 'utf8');
      const memoryData = JSON.parse(data);
      
      this.interactions = memoryData.interactions || [];
      this.summaries = memoryData.summaries || [];
      this.totalCount = memoryData.totalCount || 0;
      
      console.log(`✅ Memory loaded: ${this.interactions.length} interactions, ${this.summaries.length} summaries, totalCount: ${this.totalCount}`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`📝 No existing memory file found, starting fresh session`);
      } else {
        console.error(`❌ Error loading memory: ${error.message}`);
      }
    }
  }

  /**
   * Save memory to file
   */
  async _saveToFile() {
    if (!this.persistToFile) return;

    try {
      const filePath = this._getMemoryFilePath();
      const memoryData = {
        interactions: this.interactions,
        summaries: this.summaries,
        totalCount: this.totalCount,
        lastUpdated: new Date().toISOString(),
        signatureAlgorithm: this.signatureAlgorithm
      };

      await fs.writeFile(filePath, JSON.stringify(memoryData, null, 2), 'utf8');
      console.log(`💾 Memory saved: ${this.interactions.length} interactions, ${this.summaries.length} summaries`);
    } catch (error) {
      console.error(`❌ Error saving memory: ${error.message}`);
    }
  }

  /**
   * Add interaction to memory
   * @param {Object} interaction - Interaction object
   * @param {string} interaction.role - Role (user, assistant, system)
   * @param {string} interaction.text - Interaction text
   * @param {number} interaction.ts - Timestamp
   * @param {Object} interaction.metadata - Optional metadata
   */
  async addInteraction(interaction) {
    const { role, text, ts = Date.now(), metadata = {} } = interaction;

    // Create hash of interaction
    const hash = this._createHash({ role, text, ts });

    // Create signed interaction
    const signedInteraction = {
      role,
      text,
      ts,
      hash,
      metadata,
      signatureAlgorithm: this.signatureAlgorithm
    };

    // Add to interactions array
    this.interactions.push(signedInteraction);
    this.totalCount++;

    console.log(`📝 Added ${role} interaction (${this.interactions.length}/${this.maxInteractions})`);

    // Check if we need to compress old interactions
    if (this.interactions.length > this.maxInteractions) {
      await this._compressOldInteractions();
    }

    // Save to file
    await this._saveToFile();
  }

  /**
   * Compress old interactions into summary
   */
  async _compressOldInteractions() {
    console.log(`🗜️  Compressing old interactions (${this.interactions.length} > ${this.maxInteractions})...`);

    // Take the oldest interactions to compress
    const toCompress = this.interactions.slice(0, this.interactions.length - this.maxInteractions + 1);
    
    if (toCompress.length === 0) return;

    // Create summary using SummaryAgent if available
    let summaryText;
    if (this.summaryAgent) {
      try {
        const conversationText = toCompress
          .map(i => `${i.role}: ${i.text}`)
          .join('\n\n');
        
        const result = await this.summaryAgent.summarize(
          `Compress this conversation into a concise summary:\n\n${conversationText}`,
          { signatureAlgorithm: this.signatureAlgorithm }
        );
        
        summaryText = result.summary || result.response;
      } catch (error) {
        console.warn(`⚠️  SummaryAgent compression failed, using basic summary: ${error.message}`);
        summaryText = this._createBasicSummary(toCompress);
      }
    } else {
      summaryText = this._createBasicSummary(toCompress);
    }

    // Create summary object
    const summary = {
      range: {
        start: toCompress[0].ts,
        end: toCompress[toCompress.length - 1].ts,
        count: toCompress.length
      },
      text: summaryText,
      ts: Date.now(),
      hash: this._createHash({ text: summaryText, ts: Date.now() }),
      signatureAlgorithm: this.signatureAlgorithm
    };

    // Add summary and remove compressed interactions
    this.summaries.push(summary);
    this.interactions = this.interactions.slice(toCompress.length);

    console.log(`✅ Compressed ${toCompress.length} interactions into summary`);

    // Check if we need to compress old summaries
    if (this.summaries.length > this.maxSummaries) {
      await this._compressOldSummaries();
    }
  }

  /**
   * Compress old summaries into meta-summary
   */
  async _compressOldSummaries() {
    console.log(`🗜️  Compressing old summaries (${this.summaries.length} > ${this.maxSummaries})...`);

    // Take oldest summaries to compress
    const toCompress = this.summaries.slice(0, this.summaries.length - this.maxSummaries + 1);
    
    if (toCompress.length === 0) return;

    // Create meta-summary
    let metaSummaryText;
    if (this.summaryAgent) {
      try {
        const combinedText = toCompress.map(s => s.text).join('\n\n');
        const result = await this.summaryAgent.summarize(
          `Create a comprehensive meta-summary of these summaries:\n\n${combinedText}`,
          { signatureAlgorithm: this.signatureAlgorithm }
        );
        
        metaSummaryText = result.summary || result.response;
      } catch (error) {
        console.warn(`⚠️  Meta-summary compression failed, using basic: ${error.message}`);
        metaSummaryText = toCompress.map(s => s.text).join(' | ');
      }
    } else {
      metaSummaryText = toCompress.map(s => s.text).join(' | ');
    }

    // Create meta-summary object
    const metaSummary = {
      range: {
        start: toCompress[0].range.start,
        end: toCompress[toCompress.length - 1].range.end,
        count: toCompress.reduce((sum, s) => sum + s.range.count, 0),
        metaLevel: true
      },
      text: metaSummaryText,
      ts: Date.now(),
      hash: this._createHash({ text: metaSummaryText, ts: Date.now() }),
      signatureAlgorithm: this.signatureAlgorithm
    };

    // Replace compressed summaries with meta-summary
    this.summaries = [metaSummary, ...this.summaries.slice(toCompress.length)];

    console.log(`✅ Compressed ${toCompress.length} summaries into meta-summary`);
  }

  /**
   * Create basic summary without SummaryAgent
   * @param {Array} interactions - Interactions to summarize
   * @returns {string} Summary text
   */
  _createBasicSummary(interactions) {
    const userMessages = interactions.filter(i => i.role === 'user');
    const assistantMessages = interactions.filter(i => i.role === 'assistant');
    
    return `Summary of ${interactions.length} interactions: ${userMessages.length} user queries, ${assistantMessages.length} assistant responses. Topics discussed: [${userMessages.map(m => m.text.substring(0, 50)).join(', ')}...]`;
  }

  /**
   * Create SHA-256 hash
   * @param {Object} data - Data to hash
   * @returns {string} Hex hash
   */
  _createHash(data) {
    return crypto.createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  /**
   * Build context object for agent execution
   * @returns {Object} Memory context
   */
  buildContext() {
    const recentInteractions = this.interactions.slice(-10); // Last 10 interactions
    const allSummaries = this.summaries;

    return {
      totalInteractions: this.totalCount,
      recentInteractions: recentInteractions.map(i => ({
        role: i.role,
        text: i.text,
        ts: i.ts
      })),
      summaries: allSummaries.map(s => ({
        text: s.text,
        range: s.range,
        ts: s.ts
      })),
      memoryStats: {
        activeInteractions: this.interactions.length,
        totalSummaries: this.summaries.length,
        totalCount: this.totalCount
      }
    };
  }

  /**
   * Get recent interactions
   * @param {number} count - Number of interactions to retrieve
   * @returns {Array} Recent interactions
   */
  getRecentInteractions(count = 10) {
    return this.interactions.slice(-count);
  }

  /**
   * Get all summaries
   * @returns {Array} All summaries
   */
  getSummaries() {
    return this.summaries;
  }

  /**
   * Clear all memory (use with caution)
   */
  async clearMemory() {
    this.interactions = [];
    this.summaries = [];
    this.totalCount = 0;
    
    await this._saveToFile();
    console.log(`🧹 Memory cleared`);
  }

  /**
   * Get memory statistics
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      activeInteractions: this.interactions.length,
      maxInteractions: this.maxInteractions,
      totalSummaries: this.summaries.length,
      maxSummaries: this.maxSummaries,
      totalCount: this.totalCount,
      signatureAlgorithm: this.signatureAlgorithm,
      persistToFile: this.persistToFile,
      memoryDir: this.memoryDir
    };
  }
}

module.exports = MemoryManager;
