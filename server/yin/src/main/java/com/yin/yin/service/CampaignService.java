package com.yin.yin.service;

import com.yin.yin.common.PageResult;
import com.yin.yin.model.Campaign;
import com.yin.yin.model.CampaignStatus;
import com.yin.yin.model.CampaignType;

import java.util.List;

/**
 * 活动服务接口
 */
public interface CampaignService {
    /**
     * 获取活动详情
     */
    Campaign getCampaignDetail(Long id);

    /**
     * 分页查询活动列表
     */
    PageResult<Campaign> listCampaigns(String keyword, Integer type, Integer status, Integer pageNum, Integer pageSize);

    /**
     * 获取所有活动类型
     */
    List<CampaignType> getAllTypes();

    /**
     * 获取所有活动状态
     */
    List<CampaignStatus> getAllStatus();

    /**
     * 添加活动
     */
    int addCampaign(Campaign campaign);

    /**
     * 更新活动
     */
    int updateCampaign(Campaign campaign);

    /**
     * 删除活动
     */
    int deleteCampaign(Long id);
}
